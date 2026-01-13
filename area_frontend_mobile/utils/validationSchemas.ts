import * as Yup from 'yup';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("L'email n'est pas valide")
        .required("L'email est requis"),
    password: Yup.string()
        .matches(passwordRules, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial')
        .required("Le mot de passe est requis")
});

export const registerValidationSchema = Yup.object().shape({
    username: Yup.string()
        .required("Le nom d'utilisateur est requis"),
    email: Yup.string()
        .email("L'email n'est pas valide")
        .required("L'email est requis"),
    password: Yup.string()
        .matches(passwordRules, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial')
        .required("Le mot de passe est requis"),
    confirmPassword: Yup.string()
        .matches(passwordRules, 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial')
        .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre').required('La confirmation est requise')
});
