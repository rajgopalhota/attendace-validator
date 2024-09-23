import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import React from "react";
import * as XLSX from "xlsx";

const NotPostedTab = () => {
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(sheet);

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
        "posting_date_time",
        "createon",
        "createby",
        "ipaddress",
      ];
      json = json.map((row) => {
        columnsToRemove.forEach((col) => delete row[col]);
        return row;
      });

      const convertExcelDate = (excelDate) => {
        const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
      };

      json = json.map((row) => ({
        ...row,
        class_date: convertExcelDate(row.class_date),
      }));

      json = json.filter((row) => row.hour_no >= 1 && row.hour_no <= 11);

      const newSheet = XLSX.utils.json_to_sheet(json);
      const headers = Object.keys(json[0]).map((header) => {
        return header
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      });

      XLSX.utils.sheet_add_aoa(newSheet, [headers], { origin: "A1" });

      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Not Posted Data");
      const currentDate = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      XLSX.writeFile(
        newWorkbook,
        `Attendance Not Posted Data.xlsx`
      );
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <img src="/2.gif" className="mix-blend-multiply w-1/2" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Upload Not Posted Attendance CSV
      </h1>
      <Upload beforeUpload={handleFileUpload} showUploadList={false} className="z-10">
        <Button
          icon={<UploadOutlined />}
          size="large"
          className="font-semibold"
        >
          Upload CSV
        </Button>
      </Upload>
    </div>
  );
};

export default NotPostedTab;
