package fr.cea.nabla.web.internal.server.lsp;

import java.io.ByteArrayInputStream;
import java.io.FilterInputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

import javax.websocket.MessageHandler;

import org.eclipse.lsp4j.jsonrpc.RemoteEndpoint;
import org.eclipse.lsp4j.jsonrpc.json.StreamMessageProducer;
import org.eclipse.xtend.lib.annotations.FinalFieldsConstructor;
import org.eclipse.xtext.xbase.lib.CollectionLiterals;
import org.eclipse.xtext.xbase.lib.IterableExtensions;

/**
 * Web socket message handler that produces LSP4J messages.
 */
@FinalFieldsConstructor
@SuppressWarnings("all")
public class LanguageMessageHandler implements MessageHandler.Partial<String> {
	protected static class PartialMessageInputStream extends FilterInputStream {
		private final List<byte[]> messages;

		private int currentMessageIndex = 0;

		protected PartialMessageInputStream(final List<byte[]> messages) {
			super(new ByteArrayInputStream(IterableExtensions.<byte[]>head(messages)));
			this.messages = messages;
		}

		protected boolean nextMessage() {
			this.currentMessageIndex++;
			int _size = this.messages.size();
			boolean _lessThan = (this.currentMessageIndex < _size);
			if (_lessThan) {
				byte[] _get = this.messages.get(this.currentMessageIndex);
				ByteArrayInputStream _byteArrayInputStream = new ByteArrayInputStream(_get);
				this.in = _byteArrayInputStream;
				return true;
			} else {
				return false;
			}
		}

		@Override
		public int available() throws IOException {
			final int current = super.available();
			if (((current <= 0) && this.nextMessage())) {
				return super.available();
			} else {
				return current;
			}
		}

		@Override
		public int read() throws IOException {
			final int current = super.read();
			if (((current < 0) && this.nextMessage())) {
				return super.read();
			} else {
				return current;
			}
		}

		@Override
		public int read(final byte[] b) throws IOException {
			final int current = super.read(b);
			if (((current <= 0) && this.nextMessage())) {
				return super.read(b);
			} else {
				return current;
			}
		}

		@Override
		public int read(final byte[] b, final int off, final int len) throws IOException {
			final int current = super.read(b, off, len);
			if (((current <= 0) && this.nextMessage())) {
				return super.read(b, off, len);
			} else {
				return current;
			}
		}

		@Override
		public boolean markSupported() {
			return false;
		}
	}

	private final StreamMessageProducer messageProducer;

	private final RemoteEndpoint serverEndpoint;

	private final List<byte[]> messages = CollectionLiterals.<byte[]>newArrayList();

	@Override
	public void onMessage(final String partialMessage, final boolean last) {
		int _length = partialMessage.length();
		boolean _greaterThan = (_length > 0);
		if (_greaterThan) {
			this.messages.add(partialMessage.getBytes(Charset.forName("UTF-8")));
		}
		if ((last && (!this.messages.isEmpty()))) {
			LanguageMessageHandler.PartialMessageInputStream _partialMessageInputStream = new LanguageMessageHandler.PartialMessageInputStream(
					this.messages);
			this.messageProducer.setInput(_partialMessageInputStream);
			this.messageProducer.listen(this.serverEndpoint);
			this.messages.clear();
		}
	}

	public LanguageMessageHandler(final StreamMessageProducer messageProducer, final RemoteEndpoint serverEndpoint) {
		super();
		this.messageProducer = messageProducer;
		this.serverEndpoint = serverEndpoint;
	}
}
