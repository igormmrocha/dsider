// pages/qrcodevalidator.tsx
import { GetServerSidePropsContext } from "next";
import { getServerSession, Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import QrCodeValidator from '../components/QrCodeValidator';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import Logo from '../logo/logo.png';
import { signOut, useSession } from "next-auth/react";
import Photo from '../logo/no_one.jpg';

interface QRCodeValidatorProps {
  question: string;
}

const QRCodeValidator: React.FC<QRCodeValidatorProps> = ({ question }) => {
  const router = useRouter();
  const { data } = useSession();

  useEffect(() => {
    if (!question) {
      router.replace("/");
    }
  }, [question, router]);

  return (
    <div className="bg-green-300">
      <Navbar fluid rounded>
        <Navbar.Brand>
          <img src={Logo.src} style={{ width: 50, height: 50 }} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold">DSIDER</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={data?.user?.image || Photo.src} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm"> {data?.user?.name}</span>
              <span className="block truncate text-sm font-medium">{data?.user?.email}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={async () => {
              window.location.href = "/home";
            }}>Home
            </Dropdown.Item>
            <Dropdown.Item onClick={async () => {
              window.location.href = "/sharedquestion";
            }}>Shared question
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/";
            }}>Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
        <QrCodeValidator
        question={question}
        userEmail={data?.user?.email}
        userPhoto={data?.user?.image}
        userName={data?.user?.name}
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
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      question: query.question ? query.question : '',
    },
  };
};
