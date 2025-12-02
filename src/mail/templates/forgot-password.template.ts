// src/utils/email-templates/emailTemplates.ts
import Mailgen from 'mailgen';
import moment from 'moment';

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'AlFurqan International',
    link: 'alfurqaninternational.org',
    logo: 'https://res.cloudinary.com/dtrdvz70q/image/upload/v1739828532/AIM%20Event%27s%20Images/tmp-2-1739828526573_hu8ipf.png',
    logoHeight: '120px',
    copyright: `© ${new Date().getFullYear()} AlFurqan Institute Michigan. All rights reserved.`,
  },
});

// Social media icons + links
const socialMediaLinks = [
  {
    name: 'X',
    icon: 'https://img.icons8.com/?size=100&id=phOKFKYpe00C&format=png&color=000000',
    link: 'https://x.com/alfurqan_im',
  },
];

const socialIconsHTML = socialMediaLinks
  .map(
    (platform) =>
      `<a href="${platform.link}" target="_blank"><img src="${platform.icon}" alt="${platform.name}" /></a>`,
  )
  .join(' ');

// -------------------------------------------------------
// GENERATE PASSWORD RESET EMAIL
// -------------------------------------------------------
export const forgotPasswordTemplate = ({
  firstName,
  lastName,
  email,
  token,
  origin,
}: {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  origin: string;
}) => {
  const resetPassword = `${origin}/authentication/resetpassword?token=${token}&email=${email}`;
  const emailContent = {
    body: {
      greeting: 'Dear',
      name: `${firstName} ${lastName}`,
      intro: 'We received a request to reset your password.',
      action: {
        instructions:
          'Click the button below to set a new password. If you did not request this, ignore this email.',
        button: {
          color: '#D03801',
          text: 'Reset Password',
          link: resetPassword,
        },
      },
      signature: 'Regards',
      outro: 'This reset link will expire in 15 minutes for security reasons.',
      dictionary: {
        date: moment().format('MMMM Do YYYY'),
        address: 'AlFurqan International Missionary',
        handles: socialIconsHTML,
      },
    },
  };

  return mailGenerator.generate(emailContent);
};
