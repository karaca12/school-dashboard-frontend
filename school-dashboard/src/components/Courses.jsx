import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AssignmentInd, Book, LibraryBooks } from "@mui/icons-material";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    axios
      .get("https://localhost:44305/lectures/getall")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

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
          <LibraryBooks fontSize="large" />
          All Courses
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
                <AccordionDetails>
                  <Typography variant="body2">
                    {course.lectureDescription}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="h6">There are no courses.</Typography>
          )}
        </div>
      </Box>
    </div>
  );
};

export default Courses;
