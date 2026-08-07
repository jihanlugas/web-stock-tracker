import { LoginUser } from "@/types/auth";
import { NextPage } from "next";

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  return (
    <div>Dashboard</div>
  )
}


export default Index;