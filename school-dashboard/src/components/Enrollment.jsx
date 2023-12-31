import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUser } from "./UserContext";
import ConfirmationDialog from "./ConfirmationDialog";
import SuccessAlert from "./SuccessAlert";
import { LibraryAdd, Book, AssignmentInd } from "@mui/icons-material";

function Enrollment() {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useUser();
  const userSchoolNumber = user?.userSchoolNumber;

  const fetchEnrollmentLectures = async () => {
    try {
      const response = await axios.get(
        `https://localhost:44305/users/getEnrollmentLectures/${userSchoolNumber}`
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching enrollment lectures:", error);
    }
  };

  useEffect(() => {
    fetchEnrollmentLectures();
  }, []);

  const enrollToLecture = async (lectureName) => {
    setSelectedCourse(lectureName);
    setConfirmDialogOpen(true);
  };

  const handleConfirmEnrollment = async () => {
    try {
      await axios.post(
        `https://localhost:44305/users/enroll/${userSchoolNumber}/to/${selectedCourse}`
      );
      setShowSuccessAlert(true);
      setSuccessMessage("Enrolled successfully!");
      fetchEnrollmentLectures();
    } catch (error) {
      console.error("Error enrolling in lecture:", error);
    }
    setConfirmDialogOpen(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div
      style={{
        padding: "50px",
        height: "calc(84vh - 10px)",
        backgroundColor: "#e9e7ef",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        maxWidth={1200}
        alignItems="center"
        justifyContent="flex-start"
        padding={3}
        borderRadius={5}
        boxShadow="5px 5px 10px #ccc"
        sx={{
          ":hover": {
            boxShadow: "10px 10px 20px #ccc",
          },
          bgcolor: "#fdefd0",
        }}
      >
        <Typography variant="h3" textAlign="center" sx={{ margin: 5 }}>
          <LibraryAdd fontSize="large" />
          Course Enrollment
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            maxHeight: "550px",
            overflow: "auto",
          }}
        >
          <SuccessAlert
            show={showSuccessAlert}
            message={successMessage}
            onClose={() => setShowSuccessAlert(false)}
          />
          {courses.length !== 0 ? (
            courses.map((course) => (
              <Accordion
                sx={{
                  mt: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80%",
                  bgcolor: "#e9e7ef",
                }}
                key={course.lectureName}
                expanded={expanded === course.lectureName}
                onChange={handleChange(course.lectureName)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly !important",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "80%",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "50%",
                      }}
                    >
                      <Book />
                      <Typography variant="body1">
                        {course.lectureName}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "50%",
                      }}
                    >
                      <AssignmentInd />
                      <Typography variant="body1">
                        {course.lectureLecturerName}
                      </Typography>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <Typography variant="body2">
                    {course.lectureDescription}
                  </Typography>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={() => {
                        setShowSuccessAlert(false);
                        enrollToLecture(course.lectureName);
                      }}
                      variant="contained"
                      sx={{
                        bgcolor: "#5a395b",
                        "&:hover": { bgcolor: "#5a395b" },
                      }}
                    >
                      Enroll
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="h6">
              There are no courses to enroll.
            </Typography>
          )}
        </div>
        <ConfirmationDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmEnrollment}
          title={"Confirm Enrollment"}
          content={
            "Are you sure you want to enroll in  " + selectedCourse + "?"
          }
        />
      </Box>
    </div>
  );
}

export default Enrollment;
