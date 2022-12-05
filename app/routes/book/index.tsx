import { useState } from "react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";

// packages
import { useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";

// types
import type { MetaFunction } from "@remix-run/node"; // or cloudflare/deno
import type { LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return {
      title: "Missing data",
      description: `No data found. 😢`,
    };
  }

  return {
    title: `Confirm your ${data.data.duration} Min Meeting with ${data.data.name} | Cal.com`,
    description: "Scheduled meeting or something",
  };
};

type LoaderData = {
  data: {
    name: string;
    duration: string;
    date: string;
    time: string;
    hourType: string;
  };
};

type ActionData =
  | {
      name: null | string;
      email: null | string;
      guestEmail: null | string;
    }
  | undefined;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const duration = url.searchParams.get("duration") || "";
  const date = url.searchParams.get("date") || "";
  const time = url.searchParams.get("time") || "";
  const hourType = url.searchParams.get("hourType") || "24";

  return json<LoaderData>({
    data: {
      name: "Saroj Subedi",
      duration,
      date,
      time,
      hourType,
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const duration = url.searchParams.get("duration") || "30";

  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const guestEmail = formData.get("guestEmail");
  const notes = formData.get("notes");

  // need to add check for these input values to be string

  const errors: ActionData = {
    name: name ? null : "Name is required",
    email: email
      ? (email as string).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ? null
        : "That doesn't look like an email address"
      : "Email is required",
    guestEmail: guestEmail
      ? (guestEmail as string).match(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        )
        ? null
        : "This doesn't look like an email address"
      : null,
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  // here id is received after booking success
  const id = "123456";

  return redirect(
    `/booking/${id}?isSuccessBookingPage=${true}&email=${email}&meetingTimeSlug=${duration}min`
  );
};

export default function BookingPage() {
  const { data } = useLoaderData() as LoaderData;
  const errors = useActionData<ActionData>();

  const labelClassName = "text-sm font-medium text-gray-700 block";
  const inputClassName =
    "w-full p-2 mt-1 border rounded-md border-neutral-300 focus:border-black text-sm focus:ring-black";

  const errorClassName = '" mt-2 flex flex-row  items-center text-red-500"';

  const day = dayjs(data.date).format("dddd");
  const formattedDate = dayjs(data.date).format("MMMM D, YYYY");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [showGuestsField, setShowGuestsField] = useState(false);

  return (
    <main className=" flex flex-col p-24 mx-auto w-[80%]">
      <div className="bg-white border-neutral-200 flex border rounded-sm">
        {/* Meeting and user info section */}
        <section className="max-w-[50%] border-r border-gray-200 ">
          <div className="flex flex-col p-5 ">
            {/* User info start */}

            <h2 className="mt-2 break-words text-sm font-medium text-gray-600">
              <p className="ml-2">{data.name}</p>
            </h2>

            <h1 className="mb-6 break-words text-2xl font-semibold text-gray-900">
              <p className="ml-2">{data.duration} Min Meeting</p>
            </h1>

            {/* User info end */}

            {/* Meeting info start */}
            <div className="flex flex-col space-y-4 text-sm font-medium text-gray-600">
              <div className="flex flex-row w-full mr-6 space-x-2 break-words text-sm text-gray-600 font-medium items-center">
                <img
                  src="https://cal.com/app-store/dailyvideo/icon.svg"
                  alt="Cal video icon"
                  className="h-4 w-4 opacity-70 ml-2"
                />
                <p className="truncate">Cal Video</p>
              </div>

              <div className="flex flex-nowrap text-sm font-medium space-x-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-4 w-4 ml-2"
                >
                  {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path d="M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z" />
                </svg>
                <p>{data.duration} Minutes</p>
              </div>

              <div className="flex flex-nowrap text-sm font-medium space-x-2 items-center text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-4 w-4 ml-2 fill-green-500"
                >
                  {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                </svg>
                <p>
                  {data.time},{day},{formattedDate}
                </p>
              </div>

              {/* Meeting info end */}
            </div>
          </div>
        </section>

        {/* Form details */}

        <section className="h-full w-full max-w-[50%]">
          <div className="flex flex-col p-5 ">
            <Form method="post">
              <div className="mb-4">
                <p>
                  <label htmlFor="name" className={labelClassName}>
                    Your name
                  </label>
                </p>
                <input
                  type={"text"}
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  className={inputClassName}
                />

                {errors?.name ? (
                  <div className={errorClassName}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-3 w-3 fill-red-500 mr-2 inline-block"
                    >
                      {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                      <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>

                    {errors.name}
                  </div>
                ) : null}
              </div>

              <div className="mb-4">
                <p>
                  <label htmlFor="email" className={labelClassName}>
                    Email Address
                  </label>
                </p>
                <input
                  type={"email"}
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className={inputClassName}
                />

                {errors?.email ? (
                  <div className={errorClassName}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-3 w-3 fill-red-500 mr-2 inline-block"
                    >
                      {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                      <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>

                    {errors.email}
                  </div>
                ) : null}
              </div>

              {showGuestsField ? (
                <div className="mb-4">
                  <p>
                    <label htmlFor="guestEmail" className={labelClassName}>
                      Guests
                    </label>
                  </p>
                  <input
                    type={"email"}
                    id="guestEmail"
                    name="guestEmail"
                    placeholder="guest@example.com"
                    className={inputClassName}
                  />

                  {errors?.guestEmail ? (
                    <div className=" mt-2 flex flex-row  items-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-3 w-3 fill-red-500 mr-2 inline-block"
                      >
                        {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                        <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
                      </svg>

                      {errors.guestEmail}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mb-4">
                <p>
                  <label htmlFor="notes" className={labelClassName}>
                    Additional notes
                  </label>
                </p>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Please share anything that will help prepare for our meeting."
                  rows={3}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-row justify-end space-x-2">
                {!showGuestsField ? (
                  <button
                    onClick={() => setShowGuestsField(true)}
                    className="mr-auto p-2 border border-transparent hover:border hover:rounded-md hover:bg-neutral-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      className="h-4 w-4"
                    >
                      {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                      <path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                  </button>
                ) : null}

                <button className="p-2" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white p-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </Form>
          </div>
        </section>
      </div>
    </main>
  );
}
