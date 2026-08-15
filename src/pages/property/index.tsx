import MainAuth from "@/components/layout/main-auth";
import { LoginUser } from "@/types/auth";
import PageWithLayoutType from "@/types/layout";
import { NextPage } from "next";

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  return (
    <div>Property</div>
  )
}


(Index as PageWithLayoutType).layout = MainAuth;

export default Index;