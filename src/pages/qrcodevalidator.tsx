// pages/qrcodevalidator.tsx
import { GetServerSidePropsContext } from "next";
import { getServerSession, Session } from "next-auth";
import { useRouter } from "next/router";  // Import the useRouter hook
import { useEffect } from "react";  // Import the useEffect hook
import { authOptions } from "./api/auth/[...nextauth]";
import QrCodeValidator from '../components/QrCodeValidator';
import { useSession } from "next-auth/react";

interface QRCodeValidatorProps {
  question: any;
}

const QRCodeValidator: React.FC<QRCodeValidatorProps> = ({ question }) => {
  // You can use the 'question' variable and 'authOptions' to generate content or perform specific actions
  const router = useRouter();  // Access the router
  const { data } = useSession();

  useEffect(() => {
    // Check if there is no question parameter, then redirect to home page
    if (!question) {
      router.replace("/");
    }
  }, [question, router]);

  return (
    <div>
      <h1>QR Code Validator</h1>
      <p>Question: {question || 'Default Question'}</p>
      <QrCodeValidator question={question} 
      userEmail = {data?.user?.email}
      userPhoto = {data?.user?.image}
      userName = {data?.user?.name}
      />
    </div>
  );
};

export default QRCodeValidator;

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: QRCodeValidatorProps } | { redirect: { destination: string; permanent: boolean } }> => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const { query } = ctx;

  if (!session) {
    return {
      redirect: {
        destination: "/", // Redirect to the home page or any other page
        permanent: false,
      },
    };
  }

  return {
    props: {
      question: query.question ? query.question: 0,
    },
  };
};
