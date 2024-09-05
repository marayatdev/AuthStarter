import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  FileInput,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ErrorProps } from "../../../interfaces/auth";
import { register } from "../../../services/Auth/authService";
import { notifications } from "@mantine/notifications";

export interface Register {
  username: string;
  email: string;
  password: string;
  image_profile: File | null;
}

export function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorProps | null>(null);

  const form = useForm<Register>({
    mode: "uncontrolled",
    initialValues: {
      username: "marayat",
      email: "marayat@gmail.com",
      password: "1234",
      image_profile: null,
    },
    validate: {
      username: (value) => (value ? null : "username is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value ? null : "password is required"),
      image_profile: (value) => (value ? null : "image is required"),
    },
  });
  const handleSubmit = async (value: Register) => {
    form.clearErrors();
    try {
      const response = await register(value);
      if (response) {
        console.log(response);
        notifications.show({
          title: "Success",
          message: "create account successfully!",
          color: "green",
        });
        navigate("/");
      }
    } catch (error: any) {
      if (error.path && error.error) {
        form.setFieldError(error.path, error.error);
        setError(error); // แสดงข้อความ error
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Register!!!!
        </Title>

        {error && <Text c="red">{error.error}</Text>}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="username"
            placeholder="username"
            size="md"
            key={form.key("username")}
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <FileInput
            label="Profile"
            placeholder="Input your profile "
            key={form.key("image_profile")}
            {...form.getInputProps("image_profile")}
          />
          <Button fullWidth mt="xl" type="submit" size="md">
            Register
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a"> href="/" fw={700}>
            sigin
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
