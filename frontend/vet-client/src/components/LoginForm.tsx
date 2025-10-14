import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { LoginUser } from "../types/auth.dto";
import { useAuthStore } from "../store/authStore";
import { login } from "../services/auth.service";

export default function App() {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginUser>();
    const setAuth = useAuthStore((state) => state.setAuth);

    const onSubmit: SubmitHandler<LoginUser> = async (data) => {
        try {
            const { token, email, id } = await login(data);
            setAuth(token, email, id);
            console.log('user logged in');
        } catch (error) {
            console.error("Login failed", error);
        }
    };


    return (
        <form className="flex flex-col gap-2 justify-center border-2 p-4 rounded-xl bg-gray-100 " onSubmit={handleSubmit(onSubmit)}>
            <div className="flex  flex-col">
                <label>Email</label>
                <input className="bg-white px-1 rounded-md" placeholder="Email" {...register("email", { required: true })} />
                {errors.email && <span>This field is required</span>}
            </div>

            <div className="flex  flex-col">
                <label>Password</label>
                <input className="bg-white px-1 rounded-md" type="password" placeholder="Password" {...register("password", { required: true })} />
                {errors.password && <span>This field is required</span>}
            </div>


            <input type="submit" />
        </form>
    );
}