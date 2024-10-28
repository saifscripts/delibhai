import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillPlusSquare } from "react-icons/ai";
import * as yup from "yup";
import Button from "../../../../components/ui/Button";
import { AddressFields } from "../../../../features/AddressFields";
import { useAuth } from "../../../../hooks/auth.hook";
import Modal from "../../../../layouts/Modal";
import { useUpdateRiderMutation } from "../../../../redux/features/user copy/riderApi";
import getAddressId from "../../utils/getAddressId";
import AddressModal from "./AddressModal";
import ServiceAddressCard from "./ServiceAddressCard";
import ServiceTimes from "./ServiceTimes";

const userSchema = yup.object({
  serviceType: yup
    .string()
    .oneOf(
      ["ব্যক্তিগত", "ভাড়ায় চালিত"],
      "${value} is an invalid service type.",
    ),
  rentType: yup
    .string()
    .oneOf(
      ["লোকাল ভাড়া", "রিজার্ভ ভাড়া", "লোকাল ও রিজার্ভ ভাড়া", "কন্টাক্ট ভাড়া"],
      "${value} is an invalid rent type.",
    ),
});

export default function EditServiceInfo({ isOpen, onClose }) {
  const [serviceAddress, setServiceAddress] = useState([]);
  const [address, setAddress] = useState(null);
  const [mainStationAddress, setMainStationAddress] = useState({});
  const [addressIndex, setAddressIndex] = useState(null);
  const [serviceTimes, setServiceTimes] = useState([]);
  const [is24HourServiceTime, setIs24HourServiceTime] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [updateRider] = useUpdateRiderMutation();
  const { user } = useAuth();

  useEffect(() => {
    const mainStation = user?.mainStation;
    const serviceAddress = user?.serviceAddress;
    const serviceTimes = user?.serviceTimes;

    mainStation && setMainStationAddress(mainStation);
    serviceAddress && setServiceAddress(serviceAddress);
    serviceTimes && setServiceTimes(serviceTimes);
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      serviceType: user?.serviceType,
      rentType: user?.rentType,
    },
  });

  const onSubmit = async (data) => {
    const address = getAddressId(mainStationAddress);
    data.mainStation = isEmpty(address) ? undefined : address;
    // data.mainStation = getAddressId(mainStationAddress);

    data.serviceAddress = serviceAddress?.map((address) =>
      getAddressId(address),
    );

    if (is24HourServiceTime) {
      data.serviceTimes = [{ start: "00:00", end: "23:59" }];
    } else {
      data.serviceTimes = serviceTimes;
    }

    // Update data
    const result = await updateRider(data);

    if (result?.data?.success) {
      onClose();
    } else {
      console.log(result?.error?.data);
      setError("general", { message: result?.error?.data?.message });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeBtn headerText="সার্ভিস তথ্য">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[512px] max-w-full">
        <div className="mb-1 mt-4">
          <label className="font-bold">গাড়ির ব্যবহার</label>
          <select
            {...register("serviceType")}
            disabled={isSubmitting}
            className="w-full border-b border-primary bg-transparent py-3"
          >
            <option value="ব্যক্তিগত">ব্যক্তিগত</option>
            <option value="ভাড়ায় চালিত">ভাড়ায় চালিত</option>
          </select>
          <p className="text-red-400">{errors.serviceType?.message}</p>
        </div>

        <div className="mb-1 mt-4">
          <label className="font-bold">গাড়ির সেবা</label>
          <select
            {...register("rentType")}
            disabled={isSubmitting}
            className="w-full border-b border-primary bg-transparent py-3"
          >
            <option value="লোকাল ভাড়া">লোকাল ভাড়া</option>
            <option value="রিজার্ভ ভাড়া">রিজার্ভ ভাড়া</option>
            <option value="লোকাল ও রিজার্ভ ভাড়া">লোকাল ও রিজার্ভ ভাড়া</option>
            <option value="কন্টাক্ট ভাড়া">কন্টাক্ট ভাড়া</option>
          </select>
          <p className="text-red-400">{errors.rentType?.message}</p>
        </div>

        <p className="border-light mb-3 mt-4 border-b py-3 font-bold">
          প্রধান স্ট্যাশন
        </p>

        <AddressFields
          villageType="select"
          address={mainStationAddress}
          setAddress={setMainStationAddress}
        />

        <p className="border-light mb-3 mt-4 border-b py-3 font-bold">
          সার্ভিস প্রদানের এলাকা
        </p>

        <div className="my-6 flex flex-col gap-2">
          {serviceAddress?.map((address, index) => (
            <ServiceAddressCard
              key={index}
              index={index}
              address={address}
              setAddress={setAddress}
              setAddressIndex={setAddressIndex}
              setIsAddressModalOpen={setIsAddressModalOpen}
              serviceAddress={serviceAddress}
              setServiceAddress={setServiceAddress}
            />
          ))}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsAddressModalOpen(true);
            setAddress(null);
            setAddressIndex(serviceAddress.length);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-2 py-2 text-xl text-white"
        >
          <AiFillPlusSquare />
          <span>নতুন এলাকা যোগ করুন</span>
        </button>

        <ServiceTimes
          serviceTimes={serviceTimes}
          setServiceTimes={setServiceTimes}
          is24HourServiceTime={is24HourServiceTime}
          setIs24HourServiceTime={setIs24HourServiceTime}
        />

        <p className="text-red-400">{errors.general?.message}</p>

        <Button disabled={isSubmitting} type="submit" value="সংরক্ষণ করুন" />
      </form>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        address={address}
        setAddress={setAddress}
        serviceAddress={serviceAddress}
        setServiceAddress={setServiceAddress}
        addressIndex={addressIndex}
      />
    </Modal>
  );
}
