import { useMemo, useState } from "react";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

// packages
import TimezoneSelect from "react-timezone-select";
import { Calendar } from "@mantine/dates";
import { useMantineTheme } from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";

// types
import type { MetaFunction } from "@remix-run/node"; // or cloudflare/deno
import type { LoaderFunction } from "@remix-run/node";
import type { ITimezoneOption } from "react-timezone-select/dist/cjs";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return {
      title: "Missing data",
      description: `No data found. 😢`,
    };
  }

  return {
    title: `${data.data.duration} Min Meeting | ${data.data.name} | Cal.com`,
    description: "Scheduled meeting or something",
  };
};

type LoaderData = {
  data: {
    name: string;
    avatar: string;
    duration: string;
    rescheduleUid: string | null;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const meetingTime = params.meetingTime || "";

  const url = new URL(request.url);
  const rescheduleUid = url.searchParams.get("rescheduleUid");

  /* We would typically use an id here from params to fetch data from backend instead of 
  using meeting time like this. This just checks for 15 and 30 only,
   */

  return json<LoaderData>({
    data: {
      name: "Saroj Subedi",
      avatar: "https://avatars.dicebear.com/api/bottts/v19.png",
      duration: meetingTime.includes("15") ? "15" : "30",
      rescheduleUid,
    },
  });
};

export default function MeetingDetails() {
  const { data } = useLoaderData() as LoaderData;

  const theme = useMantineTheme();

  const [searchParams, setSearchParams] = useSearchParams();

  const dateValue = searchParams.get("date");
  const excludedDates = [11, 12, 13, 14, 15];

  const [selectedTimezone, setSelectedTimezone] = useState<ITimezoneOption>({
    value: "Asia/Kathmandu",
    label: "(GMT+5:45) Kathmandu",
    offset: 5.75,
    abbrev: "UTC+5.75",
    altName: "Kathmandu Time",
  });
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);

  const { startTime, endTime } = {
    startTime: new Date().setHours(9, 0, 0),
    endTime: new Date().setHours(17, 0, 0),
  };
  const [hourType, setHourType] = useState<number>(12);

  const timeList = useMemo(() => {
    const date: Array<Date> = [];

    let newDate = new Date(startTime + parseInt(data.duration, 10) * 60 * 1000);
    while (newDate < new Date(endTime)) {
      date.push(newDate);
      newDate = new Date(
        newDate.getTime() + parseInt(data.duration, 10) * 60 * 1000
      );
    }

    return date;
  }, []);

  return (
    <main className=" flex flex-col p-24 mx-auto ">
      <div className="bg-white border-neutral-200 flex border rounded-sm">
        {/* Meeting and user info section */}
        <section className="max-w-[33%] ">
          <div className="flex flex-col p-5 ">
            {/* User info start */}
            <Link to="/">
              <img
                src={data.avatar}
                alt={data.name}
                className="rounded-full border-2 border-white h-10 w-10 ml-2"
              />
            </Link>

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

              {/* Meeting info end */}

              {/* Time zone picker */}
              <button
                type="button"
                onClick={() => {
                  showTimezonePicker
                    ? setShowTimezonePicker(false)
                    : setShowTimezonePicker(true);
                }}
                className="min-w-[8rem] group/timezone relative mb-2 inline-block rounded-md py-2 text-left "
              >
                <div
                  className={`flex items-center text-sm font-medium space-x-2 w-min ${
                    showTimezonePicker && "bg-gray-300 rounded-sm"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-4 w-4 ml-2"
                  >
                    {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                    <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
                  </svg>

                  <p>{selectedTimezone.value}</p>

                  {showTimezonePicker ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className="h-4 w-4"
                    >
                      {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                      <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className="h-4 w-4"
                    >
                      {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                      <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Hidden timezone picker */}
              <div
                className={` ${
                  showTimezonePicker ? "opacity-100" : "opacity-0"
                } transition-opacity mt-4 w-80 max-w-[calc(100vw-1.5rem)] rounded-sm bg-white px-4 pt-4 pb-3 shadow-sm `}
              >
                <div className="mb-4 text-sm font-medium text-gray-600">
                  Time options
                </div>

                <TimezoneSelect
                  onChange={setSelectedTimezone}
                  value={selectedTimezone}
                  onMenuClose={() => {
                    setShowTimezonePicker(false);
                  }}
                />
              </div>
            </div>

            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="h-4 w-4 mt-auto ml-2"
              >
                {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Calender date selector */}
        <section className="min-w-[33%] px-4 border-r border-l border-neutral-200">
          <div className="p-4 ">
            <Calendar
              value={new Date(dayjs(dateValue).format())}
              onChange={(v) => {
                if (v) {
                  const totalDate = dayjs(v).format("YYYY-MM-DD");

                  {
                    data.rescheduleUid
                      ? setSearchParams(
                          {
                            rescheduleUid: data.rescheduleUid,
                            date: totalDate,
                          },
                          {
                            replace: true,
                          }
                        )
                      : setSearchParams(
                          {
                            date: totalDate,
                          },
                          {
                            replace: true,
                          }
                        );
                  }
                }
              }}
              allowLevelChange={false}
              minDate={new Date()}
              firstDayOfWeek={"sunday"}
              hideOutsideDates={true}
              excludeDate={(date) => {
                // Compare acutal date data along with month to avoid excluding date of other month from showing
                return (
                  excludedDates.find((dt) => dt === date.getDate()) !==
                  undefined
                );
              }}
              size="lg"
              dayStyle={(d, mod) => {
                return mod.disabled
                  ? {
                      color: theme.colors.gray[5],
                    }
                  : {
                      backgroundColor: mod.selected
                        ? theme.colors.dark[9]
                        : theme.colors.gray[1],
                      margin: 2,
                      borderRadius: 8,
                      color: mod.selected ? theme.white : theme.black,
                    };
              }}
              renderDay={(date) => {
                const day = date.getDate();

                const isToday = dayjs(dayjs().format("YYYY-MM-DD")).isSame(
                  dayjs(dayjs(date).format("YYYY-MM-DD"))
                );

                return (
                  <div>
                    {day}
                    {isToday ? (
                      <div className="rounded-full h-1 w-1 bg-gray-600 mx-auto -mt-3 mb-3" />
                    ) : null}
                  </div>
                );
              }}
            />
          </div>
        </section>

        {/* Time selector */}
        {dateValue ? (
          <section className="h-full w-full max-w-[33%]">
            <div className="flex flex-col  p-4 text-center ">
              <div className="flex flex-row justify-between">
                <div className="flex text-gray-600">
                  <p className="font-semibold text-black">
                    {dayjs(dateValue).format("dddd,")}
                  </p>
                  {dayjs(dateValue).format("MMMM D")}
                </div>

                {/* Hour format selector */}
                <button className="bg-white rounded-md flex p-2 ">
                  <div
                    className={`p-1 rounded-sm ${
                      hourType === 12 && "bg-gray-200"
                    }`}
                    onClick={() => setHourType(12)}
                  >
                    12h
                  </div>
                  <div
                    className={`p-1 rounded-sm ${
                      hourType === 24 && "bg-gray-200"
                    }`}
                    onClick={() => setHourType(24)}
                  >
                    24h
                  </div>
                </button>
              </div>

              {/* Select time value */}
              <div className="flex flex-col gap-2 h-[calc(414px-16px)] overflow-y-auto ">
                {timeList.map((timeDate, i) => {
                  let hour;
                  let minute;
                  let ampm: "am" | "pm";

                  const tempHour = new Date(timeDate).getHours();
                  const tempMinute = new Date(timeDate).getMinutes();

                  // Need to check for 0 condition for future reference if start and end time changes

                  hour =
                    "" +
                    (hourType === 24
                      ? tempHour
                      : tempHour <= 12
                      ? tempHour
                      : tempHour - 12);
                  minute = tempMinute < 10 ? "0" + tempMinute : "" + tempMinute;
                  ampm = tempHour < 12 ? "am" : "pm";

                  let formattedTime = `${hour}:${minute}`;

                  if (hourType === 12) formattedTime += ampm;

                  return (
                    <Link
                      to={`/book?${
                        data.rescheduleUid
                          ? "rescheduleUid=" + data.rescheduleUid + "&"
                          : ""
                      }date=${dateValue}&time=${formattedTime}&hourType=${hourType}&duration=${
                        data.duration
                      }&timezone=${selectedTimezone.value}`}
                      key={i}
                      className=" border-[0.5px] border-neutral-200 rounded-md hover:bg-gray-200 hover:border hover:border-black p-2 text-center"
                    >
                      {formattedTime}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
