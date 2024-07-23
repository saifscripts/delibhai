import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import isStrongPassword from "validator/lib/isStrongPassword";
import * as yup from "yup";
import Submit from "../../../components/forms/Submit";
import MiniContainer from "../../../layouts/MiniContainer";
import Title from "../../../layouts/Title";
import { useSignupRiderMutation } from "../../../redux/features/auth/authApi";
import { isMobilePhone } from "../../../utils/isMobilePhone";

const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required.")
    .min(3, "Name must be at least 3 characters long."),
  gender: yup
    .string()
    .trim()
    .required("Gender is required.")
    .oneOf(
      ["পুরুষ", "মহিলা", "অন্যান্য"],
      "${value} is an invalid gender. Gender must be পুরুষ/মহিলা/অন্যান্য.",
    ),
  mobile: yup
    .string()
    .trim()
    .required("Mobile number is required.")
    .test("isMobilePhone", `Mobile number is invalid.`, isMobilePhone("bn-BD")),
  password: yup
    .string()
    .required("Password is required.")
    .test(
      "isStrongPassword",
      "Password must be at least 4 characters long.",
      (value) =>
        isStrongPassword(value, {
          minLength: 4,
          minLowercase: 0,
          minNumbers: 0,
          minUppercase: 0,
          minSymbols: 0,
        }),
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password.")
    .test("isMatchedPassword", "Passwords don't match.", function (value) {
      return value === this.parent.password;
    }),
});

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const [signupRider] = useSignupRiderMutation();

  const onSubmit = async (userData) => {
    const result = await signupRider(userData);

    if (result?.data?.success) {
      return navigate("/otp-verification", {
        state: {
          id: result?.data?.data?._id,
          otp: result?.data?.data?.otp,
        },
      });
    }

    if (result?.error?.status === 409) {
      setError("mobile", {
        message: result?.error?.data?.message,
      });
    } else if (result?.error) {
      setError("general", {
        message: result?.error?.data?.message,
      });
    }
  };

  return (
    <MiniContainer>
      <Title
        title="একটি একাউন্ট তৈরী করুন"
        subtitle="অনুগ্রহ করে সঠিক তথ্য দিয়ে একটি একাউন্ড তৈরী করুন"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1 mt-4">
          <label className="font-bold">পুরো নাম</label>
          <input
            {...register("name")}
            type="text"
            placeholder="পুরো নাম লিখুন"
            disabled={isSubmitting}
            className="w-full border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.name?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">লিঙ্গ</label>
          <select
            {...register("gender")}
            disabled={isSubmitting}
            className="w-full border-b border-primary bg-transparent py-3"
          >
            <option value="পুরুষ">পুরুষ</option>
            <option value="মহিলা">মহিলা</option>
            <option value="অন্যান্য">অন্যান্য</option>
          </select>
          <p className="text-red-400">{errors.gender?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">মোবাইল নাম্বার</label>
          <input
            {...register("mobile")}
            type="text"
            placeholder="মোবাইল নাম্বার লিখুন"
            disabled={isSubmitting}
            className="w-full border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.mobile?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">পাসওয়ার্ড</label>
          <input
            {...register("password")}
            type="password"
            placeholder="পাসওয়ার্ড দিন"
            disabled={isSubmitting}
            className="w-full border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.password?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">কনফার্ম পাসওয়ার্ড</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="পুনরায় পাসওয়ার্ড দিন"
            disabled={isSubmitting}
            className="w-full border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.confirmPassword?.message}</p>
        </div>

        <p className="text-red-400">{errors.general?.message}</p>

        <Submit disabled={isSubmitting} value="ওটিপি কোড পাঠান" />
      </form>
    </MiniContainer>
  );
}

export { Signup };
