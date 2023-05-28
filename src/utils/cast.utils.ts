export default class CastUtils {
	public static toInteger({ value }: { value: any }): number {
		const typeOf = typeof value;

		if (!value || !['string', 'number'].includes(typeOf)) {
			return 0;
		}

		return Number(value);
	}
}
