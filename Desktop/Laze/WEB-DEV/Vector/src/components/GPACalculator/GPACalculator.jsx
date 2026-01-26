import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  Calculator
} from 'lucide-react';
import './GPACalculator.css';

const STORAGE_KEY = 'vector_gpa_data';

const GRADE_POINTS = {
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0,
  'O': 10, // Outstanding (some universities)
  'E': 0   // Fail
};

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { semesters: [], targetCGPA: 8.5 };
  } catch {
    return { semesters: [], targetCGPA: 8.5 };
  }
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function GPACalculator({ minimal = false }) {
  const [data, setData] = useState(loadData);
  const [activeSemester, setActiveSemester] = useState(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addSemester = () => {
    const newSemester = {
      id: generateId(),
      name: `Semester ${data.semesters.length + 1}`,
      courses: []
    };
    setData({ ...data, semesters: [...data.semesters, newSemester] });
    setActiveSemester(newSemester.id);
  };

  const deleteSemester = (semId) => {
    setData({ 
      ...data, 
      semesters: data.semesters.filter(s => s.id !== semId) 
    });
    if (activeSemester === semId) {
      setActiveSemester(null);
    }
  };

  const addCourse = (semId) => {
    setData({
      ...data,
      semesters: data.semesters.map(sem => {
        if (sem.id === semId) {
          return {
            ...sem,
            courses: [...sem.courses, { id: generateId(), name: '', credits: 3, grade: 'A' }]
          };
        }
        return sem;
      })
    });
  };

  const updateCourse = (semId, courseId, field, value) => {
    setData({
      ...data,
      semesters: data.semesters.map(sem => {
        if (sem.id === semId) {
          return {
            ...sem,
            courses: sem.courses.map(course => {
              if (course.id === courseId) {
                return { ...course, [field]: value };
              }
              return course;
            })
          };
        }
        return sem;
      })
    });
  };

  const deleteCourse = (semId, courseId) => {
    setData({
      ...data,
      semesters: data.semesters.map(sem => {
        if (sem.id === semId) {
          return {
            ...sem,
            courses: sem.courses.filter(c => c.id !== courseId)
          };
        }
        return sem;
      })
    });
  };

  const calculateSGPA = (courses) => {
    if (courses.length === 0) return 0;
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    courses.forEach(course => {
      const credits = parseFloat(course.credits) || 0;
      const gradePoint = GRADE_POINTS[course.grade] || 0;
      totalCredits += credits;
      totalPoints += credits * gradePoint;
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    
    data.semesters.forEach(sem => {
      sem.courses.forEach(course => {
        const credits = parseFloat(course.credits) || 0;
        const gradePoint = GRADE_POINTS[course.grade] || 0;
        totalCredits += credits;
        totalPoints += credits * gradePoint;
      });
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getTotalCredits = () => {
    return data.semesters.reduce((sum, sem) => 
      sum + sem.courses.reduce((s, c) => s + (parseFloat(c.credits) || 0), 0), 0
    );
  };

  const cgpa = calculateCGPA();
  const currentSemester = data.semesters.find(s => s.id === activeSemester);

  if (minimal) {
    return (
      <div className="gpa-minimal">
        <div className="gpa-mini-header">
          <GraduationCap size={18} />
          <span>CGPA</span>
        </div>
        <div className="gpa-mini-value">
          <span className="cgpa-number">{cgpa}</span>
          <span className="cgpa-max">/10</span>
        </div>
        {data.semesters.length > 0 && (
          <span className="gpa-mini-info">{data.semesters.length} semesters • {getTotalCredits()} credits</span>
        )}
      </div>
    );
  }

  return (
    <div className="gpa-calculator">
      <div className="gpa-header">
        <div className="gpa-title">
          <Calculator size={20} />
          <h3>GPA Calculator</h3>
        </div>
      </div>

      <div className="cgpa-display">
        <div className="cgpa-ring">
          <svg viewBox="0 0 100 100">
            <circle className="ring-bg" cx="50" cy="50" r="45" />
            <circle 
              className="ring-progress" 
              cx="50" 
              cy="50" 
              r="45"
              strokeDasharray={`${(cgpa / 10) * 283} 283`}
            />
          </svg>
          <div className="cgpa-text">
            <span className="cgpa-value">{cgpa}</span>
            <span className="cgpa-label">CGPA</span>
          </div>
        </div>
        <div className="cgpa-info">
          <div className="info-row">
            <TrendingUp size={16} />
            <span>{data.semesters.length} Semesters</span>
          </div>
          <div className="info-row">
            <Award size={16} />
            <span>{getTotalCredits()} Total Credits</span>
          </div>
          <div className="target-cgpa">
            <label>Target CGPA:</label>
            <input
              type="number"
              value={data.targetCGPA}
              onChange={(e) => setData({ ...data, targetCGPA: parseFloat(e.target.value) || 0 })}
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="semesters-section">
        <div className="semesters-header">
          <h4>Semesters</h4>
          <button className="btn btn-primary btn-sm" onClick={addSemester}>
            <Plus size={14} />
            Add Semester
          </button>
        </div>

        {data.semesters.length === 0 ? (
          <div className="empty-semesters">
            <GraduationCap size={32} />
            <p>Add your first semester to start tracking</p>
          </div>
        ) : (
          <div className="semesters-tabs">
            {data.semesters.map((sem, index) => (
              <button
                key={sem.id}
                className={`semester-tab ${activeSemester === sem.id ? 'active' : ''}`}
                onClick={() => setActiveSemester(sem.id)}
              >
                <span>Sem {index + 1}</span>
                <span className="sgpa">{calculateSGPA(sem.courses)}</span>
              </button>
            ))}
          </div>
        )}

        {currentSemester && (
          <div className="semester-detail">
            <div className="semester-header">
              <input
                type="text"
                value={currentSemester.name}
                onChange={(e) => {
                  setData({
                    ...data,
                    semesters: data.semesters.map(s => 
                      s.id === currentSemester.id ? { ...s, name: e.target.value } : s
                    )
                  });
                }}
                className="semester-name-input"
              />
              <div className="semester-actions">
                <span className="sgpa-badge">SGPA: {calculateSGPA(currentSemester.courses)}</span>
                <button 
                  className="icon-btn danger"
                  onClick={() => deleteSemester(currentSemester.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="courses-list">
              {currentSemester.courses.length === 0 ? (
                <p className="no-courses">No courses added yet</p>
              ) : (
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSemester.courses.map(course => (
                      <tr key={course.id}>
                        <td>
                          <input
                            type="text"
                            value={course.name}
                            onChange={(e) => updateCourse(currentSemester.id, course.id, 'name', e.target.value)}
                            placeholder="Course name"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={course.credits}
                            onChange={(e) => updateCourse(currentSemester.id, course.id, 'credits', e.target.value)}
                            min="1"
                            max="10"
                          />
                        </td>
                        <td>
                          <select
                            value={course.grade}
                            onChange={(e) => updateCourse(currentSemester.id, course.id, 'grade', e.target.value)}
                          >
                            {Object.keys(GRADE_POINTS).map(grade => (
                              <option key={grade} value={grade}>{grade} ({GRADE_POINTS[grade]})</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button 
                            className="icon-btn danger"
                            onClick={() => deleteCourse(currentSemester.id, course.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              <button 
                className="add-course-btn"
                onClick={() => addCourse(currentSemester.id)}
              >
                <Plus size={14} />
                Add Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
