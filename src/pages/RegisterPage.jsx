// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useMemo, useState } from "react";

// function validateName(raw) {
//   const v = (raw ?? "").trim();
//   if (!v) return "Imię jest wymagane.";
//   if (v.length < 2) return "Imię za krótkie (min. 2 znaki).";
//   return "";
// }

// function validateEmail(raw) {
//   const v = (raw ?? "").trim().toLowerCase();
//   if (!v) return "Email jest wymagany.";
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Niepoprawny email.";
//   return "";
// }

// export default function RegisterPage() {
//   const navigate = useNavigate();
//   const { rejestracja } = useAuth();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [touched, setTouched] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const errName = useMemo(() => validateName(name), [name]);
//   const errEmail = useMemo(() => validateEmail(email), [email]);
//   const canRegister = !errName && !errEmail;

//   function wybor(role) {
//     setTouched(true);
//     setApiError("");

//     if (!canRegister) return;

//     const res = rejestracja({ name, email, role });
//     if (!res.ok) {
//       setApiError(res.error);
//       return;
//     }

//     if (role === "student") navigate("/student");
//     if (role === "instructor") navigate("/instructor");
//     if (role === "admin") navigate("/admin");
//   }

//   return (
//     <main className="auth">
//       <div className="auth__top" aria-label="Brand">
//         <img
//           src="/videos/art_cat.gif"
//           alt=""
//           className="auth__gif"
//           aria-hidden="true"
//         />
//         <div className="auth__logo">eduCATe.me</div>
//       </div>

//       <div className="auth__box">
//         <h1 className="auth__logo">REJESTRACJA</h1>

//         <label className="auth__field">
//           <input
//             type="text"
//             placeholder="IMIĘ"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             onBlur={() => setTouched(true)}
//             autoComplete="name"
//           />
//         </label>
//         {touched && errName && <p className="auth__warn">{errName}</p>}

//         <label className="auth__field">
//           <input
//             type="email"
//             placeholder="EMAIL"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             onBlur={() => setTouched(true)}
//             autoComplete="email"
//           />
//         </label>
//         {touched && errEmail && <p className="auth__warn">{errEmail}</p>}

//         {apiError && <p className="auth__warn">{apiError}</p>}

//         <p className="auth__hint">
//           {canRegister ? "Wybierz rolę" : "Uzupełnij dane"}
//         </p>

//         <div className="auth__buttons">
//           <button
//             type="button"
//             className="role-btn"
//             disabled={!canRegister}
//             onClick={() => wybor("student")}
//           >
//             STUDENT
//           </button>

//           <button
//             type="button"
//             className="role-btn"
//             disabled={!canRegister}
//             onClick={() => wybor("instructor")}
//           >
//             INSTRUKTOR
//           </button>

//           <button
//             type="button"
//             className="role-btn"
//             disabled={!canRegister}
//             onClick={() => wybor("admin")}
//           >
//             ADMIN
//           </button>
//         </div>

//         <p className="auth__hint" style={{ marginTop: 12 }}>
//           Masz konto? <Link to="/login">Zaloguj się</Link>
//         </p>
//       </div>
//     </main>
//   );
// }
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Imię za krótkie (min. 2 znaki).")
    .required("Imię jest wymagane."),
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Niepoprawny email.")
    .required("Email jest wymagany."),
});

const initialValues = {
  name: "",
  email: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { rejestracja } = useAuth();
  const [apiError, setApiError] = useState("");

  function handleRegister(values, role) {
    setApiError("");

    const res = rejestracja({
      name: values.name,
      email: values.email,
      role,
    });

    if (!res.ok) {
      setApiError(res.error);
      return;
    }

    if (role === "student") navigate("/student");
    if (role === "instructor") navigate("/instructor");
    if (role === "admin") navigate("/admin");
  }

  return (
    <main className="auth">
      <div className="auth__top" aria-label="Brand">
        <img
          src="/videos/art_cat.gif"
          alt=""
          className="auth__gif"
          aria-hidden="true"
        />
        <div className="auth__logo">eduCATe.me</div>
      </div>

      <div className="auth__box">
        <h1 className="auth__logo">REJESTRACJA</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          validateOnMount
          onSubmit={() => {}}
        >
          {({ isValid, isSubmitting, touched, errors, values }) => (
            <Form noValidate>
              <label className="auth__field">
                <Field name="name">
                  {({ field, meta }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="IMIĘ"
                      autoComplete="name"
                      aria-invalid={
                        meta.touched && meta.error ? "true" : "false"
                      }
                    />
                  )}
                </Field>
              </label>
              {touched.name && errors.name && (
                <p className="auth__warn">{errors.name}</p>
              )}

              <label className="auth__field">
                <Field name="email">
                  {({ field, meta }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="EMAIL"
                      autoComplete="email"
                      aria-invalid={
                        meta.touched && meta.error ? "true" : "false"
                      }
                    />
                  )}
                </Field>
              </label>
              {touched.email && errors.email && (
                <p className="auth__warn">{errors.email}</p>
              )}

              {apiError && <p className="auth__warn">{apiError}</p>}

              <p className="auth__hint">
                {isValid ? "Wybierz rolę" : "Uzupełnij dane"}
              </p>

              <div className="auth__buttons">
                <button
                  type="button"
                  className="role-btn"
                  data-role="student"
                  disabled={!isValid || isSubmitting}
                  onClick={() => handleRegister(values, "student")}
                >
                  STUDENT
                </button>

                <button
                  type="button"
                  className="role-btn"
                  data-role="instructor"
                  disabled={!isValid || isSubmitting}
                  onClick={() => handleRegister(values, "instructor")}
                >
                  INSTRUKTOR
                </button>

                <button
                  type="button"
                  className="role-btn"
                  data-role="admin"
                  disabled={!isValid || isSubmitting}
                  onClick={() => handleRegister(values, "admin")}
                >
                  ADMIN
                </button>
              </div>

              <p className="auth__hint" style={{ marginTop: 12 }}>
                Masz konto? <Link to="/login">Zaloguj się</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
