// /pages/Contact.jsx
import React, { useState } from 'react';

const Contact = () => { //This component renders a contact form for users to send messages, it manages form data, handle changes and display a message.
  const [formData, setFormData] = useState({ name: '', email: '', message: '' }); //This is a state for form data, stores name, email and message.
  const [submitted, setSubmitted] = useState(false); //This is a state to track whether the form has been submitted.

  const handleChange = (e) => //This function updates the formData state when an input field changes.
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { //This function is called when the form is submitted, it prevents default form submission
    e.preventDefault();
    console.log("Contact Form Data:", formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-4"> 
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      {submitted ? (
        <p>Thank you for your message! We will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
