// src/utils/email-templates/emailTemplates.ts
import Mailgen from 'mailgen';
import moment from 'moment';

const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'AlFurqan International',
    link: '#',
    logo: 'https://res.cloudinary.com/dtrdvz70q/image/upload/v1733324658/Alfurqan%20Institue%20Michigan/alfuraqan_logo_2.jpg',
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
// GENERATE VERIFICATION EMAIL
// -------------------------------------------------------
export const verifyEmailTemplate = ({
  firstName,
  lastName,
  token,
  email,
  origin,
}: {
  firstName: string;
  lastName: string;
  email: string;
  token: string | null;
  origin: string;
}) => {
  const verifyEmail = `${origin}/authentication/verify-email?token=${token}&email=${email}`;
  const emailContent = {
    body: {
      greeting: 'Dear',
      name: `${firstName} ${lastName}`,
      intro: 'Please confirm your email address to complete your registration.',
      action: {
        instructions:
          'Click the button below to confirm your email and activate your account:',
        button: {
          color: '#22BC66',
          text: 'Confirm Email',
          link: verifyEmail,
        },
      },
      signature: 'Sincerely',
      outro:
        'If you did not create this account, you can safely ignore this email.',
      dictionary: {
        date: moment().format('MMMM Do YYYY'),
        address: 'AlFurqan International Missionary',
        handles: socialIconsHTML,
      },
    },
  };

  return mailGenerator.generate(emailContent);
};
