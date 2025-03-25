// /app/auth/signup/page.tsx
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/Signup";


const SignUpPage = ({ searchParams }: { searchParams: { message: string } }) => {
  return (
    <>
    <SignUp searchParams={searchParams} />
    </>
  );
};

export default SignUpPage;
