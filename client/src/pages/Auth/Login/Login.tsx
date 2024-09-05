import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/Auth/authService";
import { useAuth } from "../../../contexts/Auth/AuthContext";
import { useState } from "react";
import { ErrorProps } from "../../../interfaces/auth";

interface Login {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useAuth();
  const [error, setError] = useState<ErrorProps | null>(null);

  const form = useForm<Login>({
    initialValues: { email: "marayat001@gmail.com", password: "1234" },
  });

  const handleSubmit = async (value: Login) => {
    try {
      const data = await login(value);
      if (data) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        setError(errorData);

        // ตั้งค่า error ที่ฟิลด์ที่เกี่ยวข้อง
        if (errorData.path && errorData.error) {
          form.setFieldError(errorData.path, errorData.error);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Login!!!
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" type="submit" size="md">
            Login
          </Button>
        </form>

        {error && (
          <Text c="red" mt="md">
            {error.error}
          </Text>
        )}

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a"> href="/register" fw={700}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
