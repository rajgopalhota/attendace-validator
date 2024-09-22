import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const PostedTab = () => {
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(sheet);

      // Remove unnecessary columns
      const columnsToRemove = [
        "campus",
        "degree",
        "aym_shortname",
        "semester_shortname",
        "posting_status",
        "student_strength",
        "present_count",
        "absent_count",
        "session_no",
        "covered_session_no",
        "co_no",
        "coi_no",
        "topics_to_cover",
        "rating_given_count",
        "rating_given_percent",
        "overall_rating",
        "remarks",
        "createon",
        "createby",
        "ipaddress",
      ];
      json = json.map((row) => {
        columnsToRemove.forEach((col) => delete row[col]);
        return row;
      });

      // Convert Excel date-time to readable format
      const convertExcelDate = (excelDate) => {
        const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        return `${day}-${month}-${year} ${hours}:${minutes}`;
      };

      // Convert all date columns
      const dateColumns = ["class_date", "posting_date_time"];
      json = json.map((row) => {
        dateColumns.forEach((col) => {
          if (row[col]) {
            row[col] = convertExcelDate(row[col]);
          }
        });
        return row;
      });

      // Split data based on 'posting_date_time'
      const inTime = [];
      const notInTime = [];
      const timeRanges = [
        ["07:10", "07:25"],
        ["09:20", "09:35"],
        ["11:10", "11:35"],
        ["13:45", "14:00"],
        ["15:40", "15:55"],
      ];

      json.forEach((row) => {
        const dateTime = row.posting_date_time;
        const time = dateTime.split(" ")[1];
        const isInTime = timeRanges.some(
          ([start, end]) => time >= start && time <= end
        );
        if (isInTime) {
          inTime.push(row);
        } else {
          notInTime.push(row);
        }
      });

      // Generate Excel files
      const formatHeaders = (data) => {
        const headers = Object.keys(data[0]).map((header) => {
          return header
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
        });
        return headers;
      };

      const inTimeSheet = XLSX.utils.json_to_sheet(inTime);
      const notInTimeSheet = XLSX.utils.json_to_sheet(notInTime);

      const inTimeHeaders = formatHeaders(inTime);
      const notInTimeHeaders = formatHeaders(notInTime);

      XLSX.utils.sheet_add_aoa(inTimeSheet, [inTimeHeaders], { origin: "A1" });
      XLSX.utils.sheet_add_aoa(notInTimeSheet, [notInTimeHeaders], {
        origin: "A1",
      });

      const inTimeWorkbook = XLSX.utils.book_new();
      const notInTimeWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        inTimeWorkbook,
        inTimeSheet,
        "Attendance In Time"
      );
      XLSX.utils.book_append_sheet(
        notInTimeWorkbook,
        notInTimeSheet,
        "Attendance Not In Time"
      );
      const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      XLSX.writeFile(inTimeWorkbook, `Attendance Posted In Time - ${currentDate}.xlsx`);
      XLSX.writeFile(notInTimeWorkbook, `Attendance Posted Not In Time - ${currentDate}.xlsx`);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  return (
    <Upload beforeUpload={handleFileUpload} showUploadList={false}>
      <Button icon={<UploadOutlined />}>Upload CSV</Button>
    </Upload>
  );
};

export default PostedTab;
