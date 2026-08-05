import { LoginUser } from "@/types/auth"
import { NextPage } from "next/types"


type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  return (
    <div>Hallo</div>
  )
}


export default Index;