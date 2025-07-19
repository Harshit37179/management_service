const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendIssueNotification = async (issue, serviceProvider) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: serviceProvider.email,
    subject: `New Issue Reported: ${issue.applianceName}`,
    html: `
      <h2>New Issue Reported</h2>
      <p><strong>Appliance:</strong> ${issue.applianceName}</p>
      <p><strong>Location:</strong> Room ${issue.room}, Floor ${issue.floor}</p>
      <p><strong>Priority:</strong> ${issue.priority}</p>
      <p><strong>Description:</strong> ${issue.description}</p>
      <p><strong>Reported by:</strong> ${issue.reportedBy}</p>
      <p><strong>Date:</strong> ${new Date(issue.createdAt).toLocaleString()}</p>
      
      <p>Please contact the facility manager to schedule a repair.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendIssueNotification };