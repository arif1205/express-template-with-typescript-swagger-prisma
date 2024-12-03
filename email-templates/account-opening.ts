export const accountOpeningTemplate = (name: string) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to App</title>
    </head>
    <body
      style="
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
      "
    >
      <div
        style="
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        "
      >
        <h1 style="color: #de840a">Welcome to App</h1>
  
        <p style="color: #555">Dear ${name},</p>
  
        <p style="color: #333">
          Welcome to the App! Your account has been successfully created. We're excited to have you join our community.
        </p>
  
        <p style="color: #555">
          If you have any questions or need assistance, please don't hesitate to contact our support team.
        </p>
  
        <p style="color: #555; margin-top: 20px;">
          Best regards,<br/>
          App Team
        </p>
       
      </div>
    </body>
  </html>
`;
};
