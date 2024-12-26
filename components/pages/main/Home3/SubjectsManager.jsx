import React, { useState } from 'react';

export default function SubjectsManager({
  subjects,
  setSubjects,
  onAddSubject,
}) {
  const [newSubject, setNewSubject] = useState({
    name: '',
    teacher: '',
    zoom_link: '',
  });
  const [editingSubject, setEditingSubject] = useState(null);

  const handleAddSubject = () => {
    onAddSubject(newSubject);
    setNewSubject({ name: '', teacher: '', zoom_link: '' });
  };

  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
  };

  const handleSaveEdit = () => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === editingSubject.id ? editingSubject : subject
      )
    );
    setEditingSubject(null);
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
  };

  if (!subjects) {
    return <div>Loading subjects...</div>;
  }

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return <div>No subjects available</div>;
  }

  return (
    <div>
      <h3>Додати новий предмет</h3>
      <input
        type="text"
        placeholder="Назва предмету"
        value={newSubject.name}
        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Викладач"
        value={newSubject.teacher}
        onChange={(e) =>
          setNewSubject({ ...newSubject, teacher: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Zoom лінк"
        value={newSubject.zoom_link}
        onChange={(e) =>
          setNewSubject({ ...newSubject, zoom_link: e.target.value })
        }
      />
      <button onClick={handleAddSubject}>Додати предмет</button>

      <h4>Список предметів:</h4>
      {subjects.map((subject) => (
        <div key={subject.id}>
          {editingSubject && editingSubject.id === subject.id ? (
            <div>
              <input
                type="text"
                placeholder="Назва предмету"
                value={editingSubject.name}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Викладач"
                value={editingSubject.teacher}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, teacher: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Zoom лінк"
                value={editingSubject.zoom_link}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, zoom_link: e.target.value })
                }
              />
              <button onClick={handleSaveEdit}>Зберегти</button>
              <button onClick={handleCancelEdit}>Скасувати</button>
            </div>
          ) : (
            <div>
              <p>
                {subject.name} - {subject.teacher}
              </p>
              <button onClick={() => handleEditSubject(subject)}>Редагувати</button>
              <button onClick={() => handleRemoveSubject(subject.id)}>
                Видалити
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
