import { useMemo, useState } from "react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

// packages
import { useSearchParams } from "@remix-run/react";

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
    title: `Your booking has been confirmed | Cal.com`,
    description: "Scheduled meeting or something",
  };
};

type LoaderData = {
  data: {
    meetingPersonName: string;
    bookersName: string;
    duration: string;
    date: string;
    time: string;
    timeZone: string;
    meetingPersonEmail: string;
    bookersEmail: string;
    guestEmail?: string[];
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const bookingId = params.bookingId || "";

  const url = new URL(request.url);
  const duration = url.searchParams.get("duration") || "";
  const bookersEmail = url.searchParams.get("email") || "";

  /* We would use an id here from params to fetch data from backend instead of 
  using static data like this,
   */

  return json<LoaderData>({
    data: {
      meetingPersonName: "Saroj Subedi",
      bookersName: "Saroj Subedi",
      duration: duration.includes("15") ? "15" : "30",
      date: "December 09, 2022",
      time: "10:00am - 10:15am",
      timeZone: "Asia/Kathmandu",
      meetingPersonEmail: "kaissaroj@gmail.com",
      bookersEmail,
    },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const duration = url.searchParams.get("duration") || "30";
  const bookersEmail = url.searchParams.get("email");

  const formData = await request.formData();

  const cancelReason = formData.get("cancelReason");

  // send cancel reason  to backend if not empty

  const id = params.bookingId;

  return redirect(
    `/booking/${id}?isSuccessBookingPage=${true}&email=${bookersEmail}&meetingTimeSlug=${duration}min&cancel=${true}`
  );
};

export default function BookingDetails() {
  const { data } = useLoaderData<LoaderData>();

  const [searchParams, setSearchParams] = useSearchParams();

  const isBookingCancelled = Boolean(searchParams.get("cancel"));

  const [cancelBooking, setCancelBooking] = useState(false);

  return (
    <main className="mx-auto max-w-3xl">
      <div className="text-center flex justify-center px-4 pt-4 pb-20">
        <div className="my-4 rounded-lg border bg-white px-8 pt-5 pb-4 text-left">
          <section>
            {/* About meeting start */}
            {isBookingCancelled ? (
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="h-5 w-5 text-red-600 fill-red-600"
                >
                  {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                </svg>
              </div>
            ) : (
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-5 w-5 text-green-600 fill-green-600"
                >
                  {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                  <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
              </div>
            )}

            <div className="mt-6 mb-8 text-center last:mb-0">
              {isBookingCancelled ? (
                <h3 className="text-2xl font-semibold leading-6 text-neutral-900">
                  This event is cancelled
                </h3>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold leading-6 text-neutral-900">
                    This meeting is scheduled
                  </h3>
                  <p className="mt-3 text-neutral-600">
                    We emailed you and the other attendees a calendar invitation
                    with all the details.
                  </p>
                </>
              )}
            </div>
          </section>
          {/* About meeting end */}

          {/* Meeting details start */}

          <section className="border-gray-200 text-neutral-900 mt-8 grid grid-cols-3 border-t pt-8 text-left">
            <div className="font-medium">What</div>
            <div className="col-span-2 mb-6 last:mb-0">
              {`${data.duration} Min Meeting between ${data.meetingPersonName}
              and ${data.bookersName}`}
            </div>

            <div className="font-medium">When</div>
            <div
              className={`col-span-2 mb-6 last:mb-0 ${
                isBookingCancelled ? "line-through" : ""
              }`}
            >
              {data.date}
              <br />
              {data.time}
              <span className="text-gray-500">{` (${data.timeZone})`}</span>
            </div>

            <div className="font-medium">Who</div>
            <div className="col-span-2 mb-6 last:mb-0">
              <div className="mb-3">
                <p> {data.meetingPersonName}</p>

                <p className="text-gray-500">{data.meetingPersonEmail}</p>
              </div>

              <div className="mb-3 last:mb-0">
                <p>{data.bookersName}</p>

                <p className="text-gray-500">{data.bookersEmail}</p>
              </div>

              {data.guestEmail?.length
                ? data.guestEmail.map((email) => {
                    return (
                      <div className="mb-3 last:mb-0">
                        <p className="text-gray-500">{email}</p>
                      </div>
                    );
                  })
                : null}
            </div>

            <div className="font-medium">Where</div>
            <div className="col-span-2 mb-6 last:mb-0">
              Web conferencing details to follow in the confirmation email.
            </div>
          </section>

          {/* About meeting end */}

          {/* Change or cancel shedule */}

          {isBookingCancelled ? null : (
            <section className="mt-5 mb-4">
              <hr className="border-gray-200 mb-8" />
              {!cancelBooking ? (
                <div className="text-center text-gray-500">
                  <span className="text-gray-900 mr-2">
                    Need to make a change?
                  </span>
                  <button className="underline mr-2 ">Reschedule</button>
                  or
                  <button
                    className="underline ml-2"
                    onClick={() => {
                      setCancelBooking(true);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Form method="post">
                  <label
                    htmlFor="cancelReason"
                    className="font-medium text-neutral-900"
                  >
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    name="cancelReason"
                    id="cancelReason"
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm hover:border-gray-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-1 mt-2 mb-4"
                    placeholder="Why are you cancelling?"
                  ></textarea>

                  <div className="flex flex-row justify-end items-center gap-3">
                    <button
                      onClick={() => {
                        setCancelBooking(false);
                      }}
                      className="border border-gray-200 rounded-lg p-2 hover:border-gray-600 hover:bg-gray-100"
                    >
                      Nevermind
                    </button>

                    <button
                      type="submit"
                      className="border rounded-lg p-2 bg-black text-white hover:opacity-80"
                    >
                      Cancel event
                    </button>
                  </div>
                </Form>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
