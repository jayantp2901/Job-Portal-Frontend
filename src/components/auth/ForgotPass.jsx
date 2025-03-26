import { Label } from '../ui/label'
import { Input } from '../ui/input'



export default function ForgotPass() {
    return <>

        <form action="POST">
            <Label>Email</Label>
            <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="miecheal#123"
            />
            <Label>New Password</Label>
            <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="miecheal#123"
            />
            <Label>Confirm Password</Label>
            <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="miecheal#123"
            />
        </form>



    </>
}