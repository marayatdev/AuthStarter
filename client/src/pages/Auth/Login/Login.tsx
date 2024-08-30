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

interface Login {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { setToken, setRefreshToken } = useAuth();

  const handleSubmit = async (value: Login) => {
    try {
      const data = await login(value);
      if (data) {
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const form = useForm<Login>({
    mode: "uncontrolled",
    initialValues: { email: "marayat@gmail.com", password: "1234" },
  });

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
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" type="submit" size="md">
            Login
          </Button>
        </form>

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
