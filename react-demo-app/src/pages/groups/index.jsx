import { GET } from "services"
import useSWR from "swr"
import { IoIosCall } from 'react-icons/io'

import styles from './style.module.sass'

function UserGroupsPage ({ store }){

  const { data } = useSWR("/groups", GET)

  console.log(data)

  return (
    <div className={styles.container}>
      {data && data.own.map(item => (
        <div key={item.id} className={styles.item}>
          <div className={styles.info}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.sub}>Участников: {item.users_count}</div>
          </div>
          <button className={styles.button} onClick={() => store.callGroup(item.id)}>
            <IoIosCall/>
          </button>
        </div>
      ))}
    </div>
  )

}

export default UserGroupsPage