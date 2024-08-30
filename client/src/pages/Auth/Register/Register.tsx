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
import axios from "axios";

interface Register {
  username: string;
  email: string;
  password: string;
  image_profile: File | null;
}

export function Register() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_ENDPOINT_API;

  const handleSubmit = async (value: Register) => {
    try {
      const formData = new FormData();
      formData.append("username", value.username);
      formData.append("email", value.email);
      formData.append("password", value.password);
      if (value.image_profile) {
        formData.append("image_profile", value.image_profile);
      }

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        console.log(response.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const form = useForm<Register>({
    mode: "uncontrolled",
    initialValues: {
      username: "marayat",
      email: "marayat@gmail.com",
      password: "1234",
      image_profile: null,
    },
  });

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Register!!!!
        </Title>

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
