import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { FieldAttributes } from 'formik';
import { useField } from 'formik';
import { ErrorMessage } from 'formik';
import type { CSSProperties } from 'react';
import { useContext, useEffect, useId, useRef, useState } from 'react';
import { FormItemBox } from './style';
import { FormContext } from '../context';

export interface FormItemProps extends FieldAttributes<any> {
	labelStyle?: CSSProperties;
	labelSx?: BoxProps['sx'];
	fieldStyle?: CSSProperties;
	fieldSx?: BoxProps['sx'];
	/**
	 * show required sign(*)
	 */
	required?: boolean;
}

const displayMap = {
	vertical: 'block',
	horizontal: 'flex',
	inline: 'inline-block',
};

const fieldDisplayMap = {
	vertical: 'block',
	horizontal: 'inline-block',
	inline: 'inline-block',
};

export default function FormItem({
	label,
	as: Comp,
	children,
	name,
	validate,
	labelStyle,
	fieldStyle,
	labelSx,
	fieldSx,
	required = false,
	...restProps
}: FormItemProps) {
	const [field, helper] = useField({ name, validate });
	const errorMsg = helper.touched ? helper.error : '';
	const fieldRef = useRef<HTMLDivElement>();
	const [fieldHeight, setFieldHeight] = useState(40);

	useEffect(() => {
		if (fieldRef.current) {
			const { height } = fieldRef.current.getBoundingClientRect();
			if (height !== fieldHeight) {
				setFieldHeight(height);
			}
		}
	}, [fieldHeight]);
	const id = useId();
	const ctx = useContext(FormContext);
	const { layout = 'horizontal' } = ctx;

	return (
		<FormItemBox display={displayMap[layout]}>
			{label && (
				<Box
					className="label-box"
					component={'label'}
					htmlFor={id}
					display={fieldDisplayMap[layout]}
					style={{...ctx.labelStyle, ...labelStyle}}
					sx={labelSx || ctx.labelSx}
				>
					{required && (
						<Box color="error.main" component={'span'}>
							*{' '}
						</Box>
					)}
					{label}:
				</Box>
			)}
			<Box
				display={fieldDisplayMap[layout]}
				sx={fieldSx || ctx.fieldSx}
				style={{
					verticalAlign: 'top',
					...ctx.fieldStyle,
					...fieldStyle,
				}}
			>
				<Comp {...restProps} {...field} id={id} error={!!errorMsg} ref={fieldRef}>
					{children}
				</Comp>

				{errorMsg && (
					<>
						<br />
						<Box color="error.main" component={'span'}>
							{<ErrorMessage name={name} />}
						</Box>
					</>
				)}
			</Box>
		</FormItemBox>
	);
}
