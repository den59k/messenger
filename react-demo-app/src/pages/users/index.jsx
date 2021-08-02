import { GET } from "services"
import useSWR from "swr"
import { IoIosCall } from 'react-icons/io'

import styles from './style.module.sass'

function UserListPage ({ store }){

  const { data } = useSWR("/users", GET)

  console.log(data)

  return (
    <div className={styles.container}>
      {data && data.map(item => (
        <div key={item.id} className={styles.item}>
          <div className={styles.info}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.sub}>@{item.login}</div>
          </div>
          <button className={styles.button} onClick={() => store.call(item.id)}>
            <IoIosCall/>
          </button>
        </div>
      ))}
    </div>
  )

}

export default UserListPage