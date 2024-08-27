import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import classes from './AuthenticationTitle.module.css';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth/AuthContext';

interface Login {
    email: string;
    password: string;
}

export function Login() {

    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const handleSubmit = async (values: Login) => {
        try {
            await loginUser(values.email, values.password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };


    const form = useForm<Login>({
        mode: 'uncontrolled',
        initialValues: { email: 'marayat@gmail.com', password: "1234" },
    });


    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="button">
                    Create account
                </Anchor>
            </Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput
                        label="Email"
                        placeholder="you@mantine.dev"
                        key={form.key('email')}
                        {...form.getInputProps('email')} />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        mt="md"
                        key={form.key('password')}
                        {...form.getInputProps('password')} />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button type="submit" fullWidth mt=" xl">
                        Sign in
                    </Button>
                </Paper>
            </form>
        </Container >
    );
}