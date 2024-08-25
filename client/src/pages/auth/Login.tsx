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
import { useAuth } from '../../context/AuthContext';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
    email: string;
    password: string;
}

export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Initialize the form
    const form = useForm<LoginForm>({
        initialValues: {
            email: '',
            password: '',
        },
    });

    // Handle form submission
    const handleSubmit = async (values: LoginForm) => {
        try {
            await login(values.email, values.password);
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Container size={420} my={40}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size="sm" component="button">
                        Create account
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput
                        label="Email"
                        placeholder="you@mantine.dev"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        mt="md"
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button type="submit" fullWidth mt="xl">
                        Sign in
                    </Button>
                </Paper>
            </form>
        </Container>
    );
}
