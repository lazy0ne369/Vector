import React, { useState, useEffect } from "react";
import axios from "axios";
console.log("AddStudent component loaded");

function AddStudent({ fetchStudents, selected, setSelected }) {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: ""
  });

  useEffect(() => {
    if (selected) {
      setStudent(selected);
    }
  }, [selected]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected) {
      await axios.put(`http://localhost:8080/students/${selected.id}`, student);
      setSelected(null);
    } else {
      await axios.post("http://localhost:8080/students", student);
    }

    setStudent({ name: "", email: "", course: "" });
    fetchStudents();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={student.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={student.email} onChange={handleChange} placeholder="Email" />
      <input name="course" value={student.course} onChange={handleChange} placeholder="Course" />
      <button type="submit">{selected ? "Update" : "Add"} Student</button>
    </form>
  );
}

export default AddStudent;