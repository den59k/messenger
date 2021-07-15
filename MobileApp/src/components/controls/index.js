import { useState, useMemo, useCallback, useRef } from "react";

export { default as Input } from './input'
export { default as Button } from './button'
export { default as SegmentButton } from './segment-button'

export function useForm(defaultValues){

	const [ formData, setFormData ] = useState(() => (defaultValues || {}))
	const [ errors, setErrors ] = useState({})
  const refs = useRef({})

	const onChange = useMemo(() => (value, key) => {

		setErrors(errors => {
			if(key in errors){
				const err = Object.assign({}, errors)
				delete err[key]
				return err
			}else{
				return errors
			}
		})
		
		setFormData(formData => ({ ...formData, [key]: value }))
	}, [ setFormData, setErrors ])

	const clear = useCallback(() => {
		setFormData({})
	}, [ setFormData ])

	const get = (key) => formData[key]

	return { formData, get, onChange, clear, errors, setErrors, refs }

}

export function getProps(name, form, next){
  const obj = {
    name: name,
		onChange: form.onChange,
		value: form.formData[name],
		error: form.errors[name],
    formRef: control => form.refs[name] = control,
  }

  if(!next) return obj

  if(typeof next === 'function') return {
    ...obj,
    returnKeyType: "done",
    onSubmitEditing: next,
    blurOnSubmit: true
  }

  return {
    ...obj,
    returnKeyType: "next",
    onSubmitEditing: () => form.refs[next].focus(),
    blurOnSubmit: false
  }
}