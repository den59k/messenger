import Button from 'components/controls/button'
import styles from './style.module.sass'

function CallWaitingPage ({ callee, status, onCancel, onAnswer, onDecline }){

  return (
    <div className={styles.container}>
      <h2>{status === "incoming"?"Входящий звонок": "Исходящий звонок"}</h2>
      <div className={styles.name}>{callee.name}</div>
      <div className={styles.sub} style={{marginTop: 0}}>@{callee.login}</div>
      <Button onClick={onCancel}>Отмена</Button>
    </div>
  )

}

export default CallWaitingPage