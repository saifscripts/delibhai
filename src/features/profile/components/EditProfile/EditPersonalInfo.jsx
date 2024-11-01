import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import Button from "../../../../components/ui/Button";
import { useMe } from "../../../../hooks/auth.hook";
import { useUpdateRider } from "../../../../hooks/user.hook";
import Modal from "../../../../layouts/Modal";
import { isNID } from "../../../../utils/isNID";

const userSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required.")
    .min(3, "Name must be at least 3 characters long."),
  fatherName: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long."),
  gender: yup
    .string()
    .required("Gender is required.")
    .oneOf(
      ["পুরুষ", "মহিলা", "অন্যান্য"],
      "${value} is an invalid gender. Gender must be পুরুষ/মহিলা/অন্যান্য.",
    ),
  bloodGroup: yup
    .string()
    .oneOf(
      ["এ+", "বি+", "এবি+", "ও+", "এ-", "বি-", "এবি-", "ও-"],
      "${value} is an invalid blood group.",
    ),
  age: yup.number().integer("{value} is not an integer value."),
  nid: yup.string().test("isValidNID", "NID is not valid.", isNID),
  nidURL: yup.mixed(),
});

export default function EditPersonalInfo({ isOpen, onClose }) {
  const {
    mutate: updateRider,
    data: updatedRider,
    isSuccess,
  } = useUpdateRider();
  const { user } = useMe();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: user?.name,
      fatherName: user?.fatherName,
      gender: user?.gender,
      bloodGroup: user?.bloodGroup,
      nid: user?.nid,
    },
  });

  const onSubmit = async (data) => {
    // If user select nid image
    if (data.nidURL[0]) {
      // Create formData and append the image file
      const formData = new FormData();
      formData.append("image", data.nidURL[0]);

      // Upload the image to the imagebb
      const imgbbResult = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData,
      );

      // If image upload is not successful, setError message and return
      if (!imgbbResult?.data?.success) {
        return toast.error(
          imgbbResult.data.error.message || "Something went wrong",
        );
      }

      // If image upload is successful, set the url as nidURL field value
      data.nidURL = imgbbResult.data.data.url;
    } else {
      // If user doesn't select any image to upload, set nidURL = undefined
      data.nidURL = undefined;
    }

    // Update data
    updateRider(data);
  };

  useEffect(() => {
    if (isSuccess && updatedRider?.success) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, updatedRider]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeBtn
      headerText="ব্যক্তিগত তথ্য"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-[512px] max-w-full">
        <div className="mb-1">
          <label className="font-bold">নিজের নাম</label>
          <input
            {...register("name")}
            type="text"
            placeholder="নিজের নাম লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.name?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">পিতার নাম</label>
          <input
            {...register("fatherName")}
            type="text"
            placeholder="পিতার নাম লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.fatherName?.message}</p>
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
          <label className="font-bold">রক্তের গ্রুপ</label>
          <select
            {...register("bloodGroup")}
            disabled={isSubmitting}
            className="w-full border-b border-primary bg-transparent py-3"
          >
            <option value="এ+">এ+</option>
            <option value="বি+">বি+</option>
            <option value="এবি+">এবি+</option>
            <option value="ও+">ও+</option>
            <option value="এ-">এ-</option>
            <option value="বি-">বি-</option>
            <option value="এবি-">এবি-</option>
            <option value="ও-">ও-</option>
          </select>
          <p className="text-red-400">{errors.bloodGroup?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">বয়স</label>
          <input
            {...register("age")}
            type="number"
            placeholder="বয়স লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.age?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">জন্মনিবন্ধন/NID নম্বর</label>
          <input
            {...register("nid")}
            type="number"
            placeholder="জন্মনিবন্ধন/NID নম্বর লিখুন"
            disabled={isSubmitting}
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.nid?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">জন্মনিবন্ধন/NID এর ছবি</label>
          <input
            {...register("nidURL")}
            type="file"
            disabled={isSubmitting}
            accept="image/*"
            className="h-full w-full overflow-y-hidden border-b border-primary py-3"
          />
          <p className="text-red-400">{errors.nidURL?.message}</p>
        </div>

        <p className="text-red-400">{errors.general?.message}</p>

        <Button disabled={isSubmitting} type="submit" value="সংরক্ষণ করুন" />
      </form>
    </Modal>
  );
}
