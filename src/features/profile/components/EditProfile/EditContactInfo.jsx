import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";
import * as yup from "yup";
import Button from "../../../../components/ui/Button";
import { useAuth } from "../../../../hooks/auth.hook";
import Modal from "../../../../layouts/Modal";
import { useUpdateRiderMutation } from "../../../../redux/features/user copy/riderApi";
import { isMobilePhone } from "../../../../utils/isMobilePhone";

const userSchema = yup.object({
  contactNo1: yup
    .string()
    .trim()
    .required("Mobile number is required.")
    .test("isMobilePhone", `Mobile number is invalid.`, isMobilePhone("bn-BD")),
  contactNo2: yup
    .string()
    .trim()
    .test("isMobilePhone", `Mobile number is invalid.`, isMobilePhone("bn-BD")),
  email: yup
    .string()
    .trim()
    .lowercase()
    .test("isValidEmail", `Email is not valid.`, isEmail),
  facebookURL: yup
    .string()
    .test("isFacebookURL", "Please provide a valid url.", isURL),
});

export default function EditContactInfo({ isOpen, onClose }) {
  const { user } = useAuth();

  const [updateRider] = useUpdateRiderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      contactNo1: user?.contactNo1,
      contactNo2: user?.contactNo2,
      email: user?.email,
      facebookURL: user?.facebookURL,
    },
  });

  const onSubmit = async (userData) => {
    const result = await updateRider(userData);

    if (result?.data?.success) {
      onClose();
    } else {
      setError("general", { message: result?.error?.data?.message });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeBtn
      headerText="কন্টাক্ট ইনফো"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-[512px] max-w-full">
        <div className="mb-1">
          <label className="font-bold">মোবাইল নাম্বার</label>
          <input
            {...register("contactNo1")}
            type="text"
            placeholder="মোবাইল নাম্বার লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.contactNo1?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">বিকল্প মোবাইল নম্বর</label>
          <input
            {...register("contactNo2")}
            type="text"
            placeholder="বিকল্প মোবাইল নাম্বার লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.contactNo2?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">ই-মেইল</label>
          <input
            {...register("email")}
            type="text"
            placeholder="ই-মেইল লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.email?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">ফেইসবুক লিংক</label>
          <input
            {...register("facebookURL")}
            type="text"
            placeholder="ফেইসবুক লিংক লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.facebookURL?.message}</p>
        </div>

        <p className="text-red-400">{errors.general?.message}</p>

        <Button disabled={isSubmitting} type="submit" value="সংরক্ষণ করুন" />
      </form>
    </Modal>
  );
}
