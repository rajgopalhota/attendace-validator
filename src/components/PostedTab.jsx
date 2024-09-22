import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaLaptopCode } from "react-icons/fa6";

const PostedTab = () => {
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
      });

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
      jsonData.forEach((row) =>
        columnsToRemove.forEach((col) => delete row[col])
      );

      // Arrays to hold "in time" and "not in time" rows
      const inTimeRows = [];
      const notInTimeRows = [];

      // Time validation ranges
      const validTimes = [
        { start: "07:10", end: "07:25" },
        { start: "09:20", end: "09:35" },
        { start: "11:10", end: "11:35" },
        { start: "13:45", end: "14:00" },
        { start: "15:40", end: "15:55" },
      ];

      // Function to check if a time is within a valid range
      const isInTimeRange = (time) => {
        return validTimes.some(
          (range) => time >= range.start && time <= range.end
        );
      };

      jsonData.forEach((row) => {
        // Ensure posting_date_time is a string before splitting
        if (
          row.posting_date_time &&
          typeof row.posting_date_time === "string"
        ) {
          const timePart = row.posting_date_time.split(" ")[1]; // Get the time part

          // Check if the time is in any valid range
          if (isInTimeRange(timePart)) {
            inTimeRows.push(row);
          } else {
            notInTimeRows.push(row);
          }
        } else {
          // If posting_date_time is not valid, consider it "not in time"
          notInTimeRows.push(row);
        }
      });

      // Convert to Excel format
      const createExcelSheet = (data, sheetName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
        const excelBuffer = XLSX.write(newWorkbook, {
          bookType: "xlsx",
          type: "array",
        });
        saveAs(
          new Blob([excelBuffer], { type: "application/octet-stream" }),
          `${sheetName}.xlsx`
        );
      };

      // Generate both "in time" and "not in time" Excel files
      if (inTimeRows.length) createExcelSheet(inTimeRows, "Attendance_in_time");
      if (notInTimeRows.length)
        createExcelSheet(notInTimeRows, "Attendance_not_in_time");
    };

    reader.readAsBinaryString(file);
    return false;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-slate-900 flex items-center gap-2">
        <FaLaptopCode /> Upload Posted Attendance CSV
      </h2>
      <Upload accept=".csv" beforeUpload={handleFile} showUploadList={false}>
        <Button icon={<UploadOutlined />} className="font-semibold" size="large">
          Click to Upload CSV
        </Button>
      </Upload>
    </div>
  );
};

export default PostedTab;
