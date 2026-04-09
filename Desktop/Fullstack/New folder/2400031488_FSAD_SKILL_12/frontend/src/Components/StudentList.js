import React, { useEffect, useState } from "react";
import axios from "axios";
import AddStudent from "./AddStudent";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchStudents = async () => {
    const res = await axios.get("http://localhost:8080/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:8080/students/${id}`);
    fetchStudents();
  };

  return (
    <div>
      <h2>Student Management System</h2>

      <AddStudent
        fetchStudents={fetchStudents}
        selected={selected}
        setSelected={setSelected}
      />

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>
                <button onClick={() => setSelected(s)}>Update</button>
                <button onClick={() => deleteStudent(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;