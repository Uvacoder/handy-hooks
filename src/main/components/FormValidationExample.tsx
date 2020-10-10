import React from 'react'
import useFormValidation from "../hooks/useFormValidation";
import validateAuth from "../utils/ValidateAuth";

const INITIAL_STATE = {
    email: "",
    password: ""
};

export default function FormValidationExample() {
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        isSubmitting
    } = useFormValidation(INITIAL_STATE, validateAuth);

    return (
        <div className="container">
            <h1>Register Here</h1>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                    value={values.email}
                    className={errors.email && "error-input"}
                    autoComplete="off"
                    placeholder="Your email address"
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
                <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className={errors.password && "error-input"}
                    name="password"
                    type="password"
                    placeholder="Choose a safe password"
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
                <div>
                    <button disabled={isSubmitting} type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}
