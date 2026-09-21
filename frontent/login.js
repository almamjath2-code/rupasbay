

/**

 * Rupa's Bay Restaurant

 * Admin Login

 */



console.log("🔐 Login JS loaded");





document.addEventListener(

    "DOMContentLoaded",

    function () {



        console.log(

            "🔐 Login page initialized"

        );





        // =====================================================

        // CHECK EXISTING LOGIN

        // =====================================================





        // =====================================================

        // GET LOGIN FORM

        // =====================================================



        const loginForm =

            document.getElementById(

                "loginForm"

            );





        if (!loginForm) {



            console.error(

                "❌ Login form not found!"

            );



            return;

        }





        console.log(

            "✅ Login form found"

        );





        // =====================================================

        // LOGIN SUBMIT

        // =====================================================



        loginForm.addEventListener(

            "submit",

            async function (e) {



                e.preventDefault();





                console.log(

                    "===================================="

                );



                console.log(

                    "📝 Login form submitted"

                );



                console.log(

                    "===================================="

                );





                // -------------------------------------------------

                // GET USERNAME

                // -------------------------------------------------



                const usernameInput =

                    document.getElementById(

                        "username"

                    );





                const passwordInput =

                    document.getElementById(

                        "password"

                    );





                if (

                    !usernameInput ||

                    !passwordInput

                ) {



                    console.error(

                        "❌ Username or password input not found"

                    );



                    return;

                }





                const username =

                    usernameInput.value.trim();





                const password =

                    passwordInput.value.trim();





                console.log(

                    "👤 Username:",

                    username

                );





                console.log(

                    "🔒 Password length:",

                    password.length

                );





                // =================================================

                // VALIDATION

                // =================================================



                if (!username) {



                    showToast(

                        "Please enter username",

                        "error"

                    );



                    usernameInput.focus();



                    return;

                }





                if (!password) {



                    showToast(

                        "Please enter password",

                        "error"

                    );



                    passwordInput.focus();



                    return;

                }





                // =================================================

                // DISABLE BUTTON

                // =================================================



                const submitButton =

                    loginForm.querySelector(

                        'button[type="submit"]'

                    );





                const originalButtonText =

                    submitButton

                        ? submitButton.innerHTML

                        : "";





                if (submitButton) {



                    submitButton.disabled =

                        true;



                    submitButton.innerHTML =

                        '<i class="fas fa-spinner fa-spin"></i> Logging in...';

                }





                try {



                    console.log(

                        "🔐 Sending login request..."

                    );





                    // =================================================

                    // LOGIN REQUEST

                    // =================================================



                    const response =

                        await fetch(

                            "http://rupas-bay-apicheck-env.eba-niam9pc4.ap-south-1.elasticbeanstalk.com/admin/login",

                            {

                                method: "POST",



                                headers: {

                                    "Content-Type":

                                        "application/json",

                                    "Accept":

                                        "application/json"

                                },



                                body: JSON.stringify({

                                    username:

                                        username,



                                    password:

                                        password

                                })

                            }

                        );





                    console.log(

                        "📊 Response status:",

                        response.status

                    );





                    // =================================================

                    // READ RESPONSE

                    // =================================================



                    const data =

                        await response.json();





                    console.log(

                        "📥 Login response:",

                        data

                    );





                    // =================================================

                    // LOGIN FAILED

                    // =================================================



                    if (!response.ok) {



                        throw new Error(

                            data.detail ||

                            "Invalid username or password"

                        );

                    }





                    // =================================================

                    // CHECK API KEY

                    // =================================================



                    if (

                        !data.api_key ||

                        !data.api_key.trim()

                    ) {



                        console.error(

                            "❌ Backend did not return API key"

                        );



                        throw new Error(

                            "API key not received from backend"

                        );

                    }





                    console.log(

                        "✅ Login successful"

                    );





                    console.log(

                        "🔑 API key received: YES"

                    );





                    // =================================================

                    // SAVE API KEY

                    //

                    // IMPORTANT:

                    // localStorage = apiKey

                    // Backend header = SECRET_KEY

                    // =================================================



                    localStorage.setItem(

                        "apiKey",

                        data.api_key.trim()

                    );





                    // =================================================

                    // VERIFY STORAGE

                    // =================================================



                    const storedKey =

                        localStorage.getItem(

                            "apiKey"

                        );





                    if (

                        !storedKey ||

                        !storedKey.trim()

                    ) {



                        throw new Error(

                            "Failed to save API key"

                        );

                    }





                    console.log(

                        "💾 API key saved: YES"

                    );





                    console.log(

                        "🔑 Stored key length:",

                        storedKey.length

                    );





                    // =================================================

                    // OPTIONAL USER NAME

                    // =================================================



                    if (data.name) {



                        localStorage.setItem(

                            "adminName",

                            data.name

                        );



                        console.log(

                            "👤 Admin name saved:",

                            data.name

                        );

                    }





                    // =================================================

                    // SUCCESS MESSAGE

                    // =================================================



                    showToast(

                        "Login Successful!",

                        "success"

                    );





                    console.log(

                        "🔐 Authentication successful"

                    );





                    console.log(

                        "🚀 Redirecting to dashboard..."

                    );





                    // =================================================

                    // REDIRECT

                    // =================================================



                    setTimeout(

                        function () {



                            window.location.href =

                                "dashboard.html";



                        },

                        500

                    );





                } catch (error) {



                    console.error(

                        "❌ Login error:",

                        error

                    );





                    showToast(

                        error.message ||

                        "Login failed",

                        "error"

                    );





                    // Re-enable button



                    if (submitButton) {



                        submitButton.disabled =

                            false;



                        submitButton.innerHTML =

                            originalButtonText;

                    }

                }

            }

        );





        // =====================================================

        // TOAST FUNCTION

        // =====================================================



        function showToast(

            message,

            type = "success"

        ) {



            // If your components.js already provides

            // Toast.success / Toast.error,

            // use that.



            if (

                typeof Toast !==

                "undefined" &&

                Toast

            ) {



                if (

                    type === "success" &&

                    typeof Toast.success ===

                    "function"

                ) {



                    Toast.success(message);



                    return;

                }





                if (

                    type === "error" &&

                    typeof Toast.error ===

                    "function"

                ) {



                    Toast.error(message);



                    return;

                }

            }





            // Fallback toast



            const toast =

                document.getElementById(

                    "toast"

                );





            if (!toast) {



                alert(message);



                return;

            }





            toast.textContent =

                message;





            toast.className =

                `toast ${type}`;





            toast.classList.add(

                "show"

            );





            setTimeout(

                function () {



                    toast.classList.remove(

                        "show"

                    );



                },

                3000

            );

        }

    }

);