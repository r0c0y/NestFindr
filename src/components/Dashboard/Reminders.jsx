import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { FaPlusCircle, FaTrash, FaRegCalendarAlt, FaMoneyBillWave, FaStickyNote, FaBell, FaEdit } from 'react-icons/fa';

const reminderSchema = yup.object().shape({
  propertyTitle: yup.string().required('Property title is required'),
  reminderDate: yup.date().required('Reminder date is required').min(new Date(), 'Date cannot be in the past'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  notes: yup.string().max(200, 'Notes cannot exceed 200 characters'),
});

const Reminders = () => {
  // Mock user for now, as AuthContext is removed
  const user = { uid: 'mockUserId' }; 
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(reminderSchema),
  });

  const fetchReminders = useCallback(() => {
    // Simulate fetching reminders from an API or local storage
    // For now, we'll use a simple in-memory array
    setLoading(true);
    try {
      const storedReminders = JSON.parse(localStorage.getItem('mockReminders')) || [];
      setReminders(storedReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const onSubmit = (data) => {
    if (!user) {
      toast.error("Please log in to set reminders.");
      return;
    }
    try {
      const newReminder = { 
        id: Date.now().toString(), // Simple unique ID
        ...data,
        reminderDate: data.reminderDate.toISOString(),
        createdAt: new Date().toISOString(),
      };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('mockReminders', JSON.stringify(updatedReminders));
      toast.success("Reminder set successfully!");
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast.error("Failed to set reminder.");
    }
  };

  const handleDelete = (reminderId) => {
    try {
      const updatedReminders = reminders.filter(reminder => reminder.id !== reminderId);
      setReminders(updatedReminders);
      localStorage.setItem('mockReminders', JSON.stringify(updatedReminders));
      toast.success("Reminder deleted!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder.");
    }
  };

  return (
    <div className="reminders-container">
      <div className="reminders-header">
        <div className="header-content">
          <FaBell className="header-icon" />
          <div>
            <h3 className="gradient-text">Mortgage Reminders</h3>
            <p>Stay on top of your property payments and deadlines</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlusCircle /> {showForm ? 'Hide Form' : 'Set New Reminder'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="reminder-form">
          <div className="form-group">
            <label><FaStickyNote /> Property Title</label>
            <input type="text" {...register('propertyTitle')} placeholder="e.g., 3 BHK Apartment" />
            {errors.propertyTitle && <span className="error">{errors.propertyTitle.message}</span>}
          </div>
          <div className="form-group">
            <label><FaRegCalendarAlt /> Reminder Date</label>
            <input type="date" {...register('reminderDate')} />
            {errors.reminderDate && <span className="error">{errors.reminderDate.message}</span>}
          </div>
          <div className="form-group">
            <label><FaMoneyBillWave /> Amount (₹)</label>
            <input type="number" {...register('amount')} placeholder="e.g., 50000" />
            {errors.amount && <span className="error">{errors.amount.message}</span>}
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea {...register('notes')} rows="3" placeholder="e.g., EMI payment, property tax" />
            {errors.notes && <span className="error">{errors.notes.message}</span>}
          </div>
          <button type="submit" className="btn-primary">
            Set Reminder
          </button>
        </form>
      )}

      <div className="reminders-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="empty-state">
            <FaBell className="empty-icon" />
            <h4>No Reminders Yet</h4>
            <p>Create your first reminder to stay on top of your property payments and important deadlines.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <FaPlusCircle /> Create First Reminder
            </button>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map(reminder => (
              <div key={reminder.id} className="reminder-item">
                <div className="reminder-header">
                  <div className="reminder-type">
                    <FaRegCalendarAlt className="reminder-type-icon" />
                    <span>Payment Reminder</span>
                  </div>
                  <div className="reminder-actions">
                    <button onClick={() => handleDelete(reminder.id)} className="btn-delete" title="Delete Reminder">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="reminder-content">
                  <h4 className="property-title">{reminder.propertyTitle}</h4>
                  <div className="reminder-info">
                    <div className="info-item">
                      <FaRegCalendarAlt className="info-icon" />
                      <span>Due: {new Date(reminder.reminderDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="info-item">
                      <FaMoneyBillWave className="info-icon" />
                      <span>₹{reminder.amount.toLocaleString()}</span>
                    </div>
                    {reminder.notes && (
                      <div className="info-item notes-item">
                        <FaStickyNote className="info-icon" />
                        <span>{reminder.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="reminder-footer">
                  <span className="created-date">
                    Created: {new Date(reminder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;