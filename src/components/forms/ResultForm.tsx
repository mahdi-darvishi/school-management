"use client";

import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createResult, updateResult } from "../../lib/actions";
import InputField from "../InputField";

//
//  IMPORTANT: You need to create `resultSchema`, `ResultSchema`,
//  `createResult`, and `updateResult` in their respective files.
//

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error("Operation failed. Please try again.");
    }
  }, [state, router, type, setOpen]);

  const { students, exams, assignments } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>

      <div className="flex justify-between  items-center gap-1 flex-wrap">
        {/* Student Selection */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
          >
            <option>Select a student</option>
            {students.map(
              (student: { id: string; name: string; surname: string }) => (
                <option value={student.id} key={student.id}>
                  {student.name + ", "} {student.surname}
                </option>
              )
            )}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Student Name"
          name="student"
          type="text"
          defaultValue={data?.studentName}
          register={register}
          error={errors?.score}
          readOnly
        />

        {/* Score Input */}
        <InputField
          label="Score"
          name="score"
          type="number"
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
        />
        <InputField
          label="Exam"
          name="exam"
          type="text"
          defaultValue={data?.title}
          register={register}
          error={errors?.score}
          readOnly
        />

        {/* Combined Exam/Assignment Selection */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">
            Assessment (Exam or Assignment)
          </label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assessmentId")}
          >
            <option value="">Select an assessment</option>
            <optgroup label="Exams">
              {exams.map((exam: { id: number; title: string }) => (
                <option value={`exam-${exam.id}`} key={`exam-${exam.id}`}>
                  {exam.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Assignments">
              {assignments.map((assignment: { id: number; title: string }) => (
                <option
                  value={`assignment-${assignment.id}`}
                  key={`assignment-${assignment.id}`}
                >
                  {assignment.title}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.assessmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assessmentId.message.toString()}
            </p>
          )}
        </div>

        {/* Hidden ID field for updates */}
        {data && (
          <input type="hidden" defaultValue={data?.id} {...register("id")} />
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
