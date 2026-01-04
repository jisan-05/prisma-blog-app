import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("*** Admin seeding Started.....");
    const adminData = {
      name:"Admin 3 Shaheb",
      email:"admin3@admin.com",
      role:UserRole.ADMIN,
      password:"admin1234"
    }
    console.log("Checking admin Exist or not");
    // check user exist on db or not 
    const existingUser = await prisma.user.findUnique({
      where:{
        email:adminData.email
      }
    })


    if(existingUser){
      throw new Error("User already existing !")
    }

    const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(adminData)
    })

    
    if(signUpAdmin.ok){
      console.log("*** admin created");
      await prisma.user.update({
        where:{
          email:adminData.email
        },
        data:{
          emailVerified:true
        }
      })
      console.log("Email Verification Updated!");
    }
    console.log("*** Success ***");

  } catch (error) {
    console.log(error);
  }
}


seedAdmin()