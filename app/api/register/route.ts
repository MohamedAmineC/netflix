import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb"


export async function POST(req:Request){
  try{
    const {email,name,password} = await req.json();
    console.log(email,name,password);
    const existingUser = await prismadb.user.findUnique({
      where:{
        email: email,
      }
    });
    if(existingUser){
      return NextResponse.json({error: 'Email Taken',status: 422})
    }
    const hashedPassword = await bcrypt.hash(password,12);
    const user = await prismadb.user.create({
      data:{
        email,
        name,
        hashedPassword,
        image: '',
        emailVerifed: new Date(),
      }
    });
    return NextResponse.json({user,status: 200});
  } catch(error){
    console.log(error)
    return NextResponse.json({error,status: 400})
  }
}
