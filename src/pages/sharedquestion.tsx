import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import Logo from '../logo/logo.png';
import Photo from '../logo/no_one.jpg';
import QrCodeQuestion from '../components/QrCodeQuestion';



export default function QrCode() {
  const { data } = useSession();
  console.log(data);
      
  
  return Component();
  function Component() {
    return (
      <div className="bg-green-300 min-h-screen">
      <Navbar fluid rounded>
        <Navbar.Brand>
          <img src= {Logo.src} style={{width: 50, height: 50}}  className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-black">DSIDER</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={data?.user?.image ||Photo.src} rounded />
            }
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
            }}>Compartilhada
            
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/";
            }}>Log out
            
            </Dropdown.Item>
          </Dropdown>
          
        </div>
        
      </Navbar>
      <QrCodeQuestion userEmail ={data?.user?.email}/>
      </div>
    );
  }
}


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};