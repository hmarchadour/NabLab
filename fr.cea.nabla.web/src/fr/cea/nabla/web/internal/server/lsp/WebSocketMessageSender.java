package fr.cea.nabla.web.internal.server.lsp;

import javax.websocket.RemoteEndpoint;
import javax.websocket.Session;

import org.eclipse.xtext.xbase.lib.Exceptions;

@SuppressWarnings("all")
public class WebSocketMessageSender {
	/**
	 * If the session provides a text buffer that is large enough, the message is
	 * sent asynchronously, otherwise it is sent synchronously in chunks.
	 */
	public void sendMessage(final String message, final Session session) {
		try {
			int _length = message.length();
			int _maxTextMessageBufferSize = session.getMaxTextMessageBufferSize();
			boolean _lessEqualsThan = (_length <= _maxTextMessageBufferSize);
			if (_lessEqualsThan) {
				session.getAsyncRemote().sendText(message);
			} else {
				int currentOffset = 0;
				while ((currentOffset < message.length())) {
					{
						int _maxTextMessageBufferSize_1 = session.getMaxTextMessageBufferSize();
						int _plus = (currentOffset + _maxTextMessageBufferSize_1);
						final int currentEnd = Math.min(_plus, message.length());
						RemoteEndpoint.Basic _basicRemote = session.getBasicRemote();
						String _substring = message.substring(currentOffset, currentEnd);
						int _length_1 = message.length();
						boolean _tripleEquals = (currentEnd == _length_1);
						_basicRemote.sendText(_substring, _tripleEquals);
						currentOffset = currentEnd;
					}
				}
			}
		} catch (Throwable _e) {
			throw Exceptions.sneakyThrow(_e);
		}
	}
}
