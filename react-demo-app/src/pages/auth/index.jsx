import { useForm, getProps, Input, Button } from "components/controls"
import { useAuth } from "providers/auth"
import styles from './style.module.sass'

function AuthPage (){

  const form = useForm()
  const auth = useAuth()

  const onLoginClick = () => {
    const { login, password } = form.formData
    auth.login(login, password).then(err => {
      if(err) return form.setErrors(err)
    })
  }

  return (
    <div className={styles.container}>
      <h2>Войти в аккаунт</h2>
      <Input {...getProps("login", form)} label="Логин" />
      <Input {...getProps("password", form)} label="Пароль" type="password"/>
      <Button onClick={onLoginClick}>Войти</Button>
    </div>
  )

}

export default AuthPage