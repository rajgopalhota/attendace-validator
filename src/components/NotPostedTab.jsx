import { Upload, Button, Spin, message } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState } from "react";
import { FaLaptopCode } from "react-icons/fa6";

const NotPostedTab = () => {
  const [loading, setLoading] = useState(false);
  const [fileProcessed, setFileProcessed] = useState(false);
  const [excelBuffer, setExcelBuffer] = useState(null);

  const handleFile = (file) => {
    setLoading(true);
    setFileProcessed(false);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
      });

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

      jsonData = jsonData.map((row) => {
        columnsToRemove.forEach((col) => delete row[col]);

        // Fix class_date column if it's in serial number format
        if (row.class_date && !isNaN(row.class_date)) {
          const parsedDate = XLSX.SSF.parse_date_code(row.class_date);
          row.class_date = `${parsedDate.y}-${String(parsedDate.m).padStart(
            2,
            "0"
          )}-${String(parsedDate.d).padStart(2, "0")}`;
        }

        return row;
      });

      jsonData = jsonData.filter(
        (row) => row.hour_no >= 1 && row.hour_no <= 11
      );

      const newWorksheet = XLSX.utils.json_to_sheet(jsonData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        newWorkbook,
        newWorksheet,
        "Not posted data"
      );

      const excelBuffer = XLSX.write(newWorkbook, {
        bookType: "xlsx",
        type: "array",
      });

      setExcelBuffer(excelBuffer);
      setLoading(false);
      setFileProcessed(true);
    };

    reader.onerror = () => {
      message.error("Error reading file. Please try again.");
      setLoading(false);
    };

    reader.readAsBinaryString(file);
    return false;
  };

  const handleDownload = () => {
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "Not_posted_data.xlsx"
    );
  };

  const handleReset = () => {
    setLoading(false);
    setFileProcessed(false);
    setExcelBuffer(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 flex items-center gap-2">
        <FaLaptopCode /> Upload Not Posted Attendance CSV
      </h2>
      <Upload
        accept=".csv"
        beforeUpload={handleFile}
        showUploadList={false}
        onRemove={handleReset}
      >
        <Button
          icon={<UploadOutlined />}
          size="large"
          className="font-semibold"
        >
          Click to Upload CSV
        </Button>
      </Upload>

      {loading && <Spin size="large" className="mt-4" />}

      {fileProcessed && !loading && (
        <Button
          icon={<DownloadOutlined />}
          className="mt-4 font-semibold"
          onClick={handleDownload}
          size="large"
        >
          Download Processed File
        </Button>
      )}
    </div>
  );
};

export default NotPostedTab;
