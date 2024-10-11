import ReturnButton from "@/ui/components/ReturnButton";
import { fireEvent, render, screen } from "@testing-library/react";

describe('ReturnButton component', () => {
    it('should render with children text', () => {
        render(<ReturnButton>Go back</ReturnButton>)
        expect(screen.getByText('Go back')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
        render(<ReturnButton className="custom-class">Go back</ReturnButton>)
        const button = screen.getByText('Go back')
        expect(button).toHaveClass('custom-class')
    })

    it('should call window.history.back when clicked', () => {
        const historyBackMock = jest.spyOn(window.history, 'back').mockImplementation(() => {})

        render(<ReturnButton>Go back</ReturnButton>)
        fireEvent.click(screen.getByText('Go back'))

        expect(historyBackMock).toHaveBeenCalledTimes(1)

        historyBackMock.mockRestore()
    })
})